import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { ParcelPrint } from '../../../models/parcel.model';
import { PrintService } from '../../../services/print/print.service';
import { ValidationService } from '../../../../shared/services/validation.service';
import {
  Subscription,
  concatMap,
  defer,
  delay,
  filter,
  finalize,
  from,
  interval,
  of,
  take,
  takeWhile,
  timer,
} from 'rxjs';
import { ParcelApiService } from '../../../services/parcel/parcel-api.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-print-barcode',
  templateUrl: './print-barcode.component.html',
  styleUrl: './print-barcode.component.scss',
})
export class PrintBarcodeComponent implements OnInit, OnDestroy {
  @ViewChild('content') content: ElementRef<HTMLDivElement>;
  @ViewChild('svgElement') svgElement: ElementRef<SVGElement>;
  @ViewChild('canvasElement') canvasElement: ElementRef<HTMLCanvasElement>;
  @ViewChild('downloadElement') downloadElement: ElementRef<HTMLLinkElement>;

  private subscription = new Subscription();
  private printService = inject(PrintService);
  private parcelApiService = inject(ParcelApiService);
  private validationService = inject(ValidationService);

  isLoading: boolean = true;
  isProcess: boolean = true;
  isSvgtoBase64: boolean = false;
  parcels: ParcelPrint[] = [];
  percentComplete: number = 0;
  fileUrl: string;
  fileName: string = 'barcode.pdf';

  ngOnInit(): void {
    this.parcels = this.printService.getParcels();
    if (this.validationService.isEmpty(this.parcels)) return;

    defer(() =>
      this.svgElement
        ? of(null)
        : interval(300).pipe(
            filter(() => !!this.svgElement),
            take(1)
          )
    ).subscribe(() => this.initPrintBarcode());
  }

  ngOnDestroy(): void {
    this.isProcess = false;
    this.subscription.unsubscribe();
  }

  onClickDownload() {
    if (!this.fileUrl) return;
    this.downloadElement.nativeElement.href = this.fileUrl;
    this.downloadElement.nativeElement.click();
  }

  private async initPrintBarcode(): Promise<void> {
    const svg = document.querySelectorAll('svg');
    for (let i = 1; i < svg.length; i++) {
      this.parcels[i - 1].fileUrl = await this.convertSvgToJpg(svg[i]);
    }
    this.downloadPdf();
  }

  private async convertSvgToJpg(svg: SVGSVGElement): Promise<string> {
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');

    const svgRect = svg.getBoundingClientRect();
    canvas.width = svgRect.width;
    canvas.height = svgRect.height;

    try {
      const image64 = this.convertSvgToBase64(svg);
      const image = await this.loadImage(image64);

      context.drawImage(image, 0, 0);
      return canvas.toDataURL('image/jpeg');
    } catch (error) {
      return null;
    }
  }

  private convertSvgToBase64(svg: SVGSVGElement): string {
    const xml = new XMLSerializer().serializeToString(svg);
    const svg64 = btoa(xml);
    const b64Start = 'data:image/svg+xml;base64,';
    const image64 = b64Start + svg64;

    return image64;
  }

  private loadImage(image64: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = image64;

      image.addEventListener('load', (e) => resolve(image));
      image.addEventListener('error', () => {
        reject(new Error(`Failed to load image's URL: ${image64}`));
      });
    });
  }

  private downloadPdf(): void {
    this.isLoading = true;

    const doc = new jsPDF('p', 'px', 'a4'); // width 446.46
    const startX = 15;
    const startY = 15;
    const columnWidth = 128.82;
    const columnHeight = 40;
    const columnGap = 15;
    const rowCountThreshold = 11;

    const delayTime = 10;
    const totalParcels = this.parcels.reduce(
      (acc, parcel) => acc + parcel.printCount,
      0
    );

    let currentX = startX;
    let currentY = startY;
    let rowCount = 0;
    let processedParcels = 0;

    this.subscription = from(this.parcels)
      .pipe(
        concatMap((parcel) => {
          const payload = {
            printCount: parcel.printCount,
            detailLog: 'ปริ้นบาร์โค้ด',
          };
          this.parcelApiService
            .updatePrintParcel(parcel.id, payload)
            .subscribe();

          return from(Array(parcel.printCount)).pipe(
            concatMap(() => of(parcel).pipe(delay(delayTime)))
          );
        }),
        finalize(() =>
          timer(500)
            .pipe(takeWhile(() => this.isProcess))
            .subscribe(() => {
              doc.save(this.fileName);

              this.fileUrl = doc.output('datauristring');
              this.isLoading = false;
              this.percentComplete = 0;
              this.printService.resetParcel();
            })
        )
      )
      .subscribe((parcel) => {
        processedParcels++;
        this.percentComplete = (processedParcels / totalParcels) * 100;

        if (!parcel.fileUrl) return;

        doc.addImage(
          parcel.fileUrl,
          currentX,
          currentY,
          columnWidth,
          columnHeight
        );
        currentX += columnWidth + columnGap;

        if (currentX + columnWidth > doc.internal.pageSize.getWidth()) {
          currentX = startX;
          currentY += columnHeight + columnGap;
          rowCount++;
        }
        if (rowCount >= rowCountThreshold) {
          doc.addPage();
          currentX = startX;
          currentY = startY;
          rowCount = 0;
        }
      });
  }
}
