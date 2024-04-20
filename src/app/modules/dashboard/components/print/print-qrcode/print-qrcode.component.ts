import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { ParcelPrint } from '../../../models/parcel.model';
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
import { PrintService } from '../../../services/print/print.service';
import { ParcelApiService } from '../../../services/parcel/parcel-api.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-print-qrcode',
  templateUrl: './print-qrcode.component.html',
  styleUrl: './print-qrcode.component.scss',
})
export class PrintQrcodeComponent implements OnInit, OnDestroy {
  @ViewChild('canvasElement') canvasElement: ElementRef<HTMLCanvasElement>;
  @ViewChild('downloadElement') downloadElement: ElementRef<HTMLLinkElement>;

  private subscription = new Subscription();
  private printService = inject(PrintService);
  private parcelApiService = inject(ParcelApiService);
  private validationService = inject(ValidationService);

  isLoading: boolean = true;
  isProcess: boolean = true;
  percentComplete: number = 0;
  parcels: ParcelPrint[] = [];
  fileUrl: string;
  fileName: string = 'qrcode.pdf';

  ngOnInit(): void {
    this.parcels = this.printService.getParcels();
    if (this.validationService.isEmpty(this.parcels)) return;

    defer(() =>
      this.canvasElement
        ? of(null)
        : interval(300).pipe(
            filter(() => !!this.canvasElement),
            take(1)
          )
    ).subscribe(() => this.initPrintQRcode());
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

  private initPrintQRcode(): void {
    const canvas = document.querySelectorAll('canvas');
    for (let i = 0; i < canvas.length; i++) {
      this.parcels[i].fileUrl = canvas[i].toDataURL();
    }

    this.downloadPdf();
  }

  private downloadPdf(): void {
    this.isLoading = true;

    const doc = new jsPDF('p', 'px', 'a4'); // width 446.46
    const startX = 15;
    const startY = 10;
    const columnWidth = 71.292;
    const columnHeight = 71.292;
    const columnGap = 15;
    const rowCountThreshold = 7;

    const delayTime = 10;
    const totalParcels = this.parcels.reduce(
      (acc, parcel) => acc + parcel.printCount,
      0
    );

    let currentX = startX;
    let currentY = startY;
    let rowCount = 0;
    let processedParcels = 0;
    doc.setFontSize(9);

    this.subscription = from(this.parcels)
      .pipe(
        concatMap((parcel) => {
          const payload = {
            printCount: parcel.printCount,
            detailLog: 'ปริ้นคิวอาร์โค้ด',
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
        doc.text(
          parcel.track,
          currentX + columnGap - 4,
          currentY + columnHeight + 2
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
