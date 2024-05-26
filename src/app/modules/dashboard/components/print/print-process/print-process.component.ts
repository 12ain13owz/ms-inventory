import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
import { ValidationService } from '../../../../shared/services/validation.service';
import { InventoryPrint } from '../../../models/inventory.model';
import jsPDF from 'jspdf';

enum Process {
  QRCode = 1,
  BarCode = 2,
}

@Component({
  selector: 'app-print-process',
  templateUrl: './print-process.component.html',
  styleUrl: './print-process.component.scss',
})
export class PrintProcessComponent implements OnInit, OnDestroy {
  @ViewChild('canvasElement') canvasElement: ElementRef<HTMLCanvasElement>;
  @ViewChild('downloadElement') downloadElement: ElementRef<HTMLLinkElement>;

  private route = inject(ActivatedRoute);
  private subscription = new Subscription();
  private printService = inject(PrintService);
  private validationService = inject(ValidationService);

  print = +this.route.snapshot.params['print'];
  percentComplete: number = 0;
  isMissing: boolean = false;
  isLoading: boolean = false;
  isProcess: boolean = false;
  inventories: InventoryPrint[] = [];
  fileUrl: string;
  fileName: string;

  ngOnInit(): void {
    if (this.print !== Process.QRCode && this.print !== Process.BarCode) {
      this.isMissing = true;
      return;
    }

    this.inventories = this.printService.getInventories();
    if (this.validationService.isEmpty(this.inventories)) {
      this.isMissing = true;
      return;
    }

    this.isLoading = true;
    this.isProcess = true;

    defer(() =>
      this.canvasElement
        ? of(null)
        : interval(300).pipe(
            filter(() => !!this.canvasElement),
            take(1)
          )
    ).subscribe(() => {
      if (this.print === Process.QRCode) {
        this.fileName = 'qrcode.pdf';
        this.processPrintQRCode();
      }
      if (this.print === Process.BarCode) {
        this.fileName = 'barcode.pdf';
        this.processPrintBarCode();
      }
    });
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

  private processPrintQRCode(): void {
    const canvas = document.querySelectorAll('canvas');
    for (let i = 0; i < canvas.length; i++) {
      this.inventories[i].fileUrl = canvas[i].toDataURL();
    }

    const doc = new jsPDF('p', 'px', 'a4'); // width 446.46
    const startX = 15;
    const startY = 10;
    const columnWidth = 71.292;
    const columnHeight = 71.292;
    const columnGap = 15;
    const columnDash = 5;
    const rowGap = 15;
    const rowDash = 20;
    const rowCountThreshold = 6;
    const lineText1 = 3;
    const lineText2 = 12;

    const delayTime = 10;
    const totalInventories = this.inventories.reduce(
      (acc, inventory) => acc + inventory.printCount,
      0
    );

    let currentX = startX;
    let currentY = startY;
    let rowCount = 0;
    let columnCount = 0;
    let processedInventories = 0;
    doc.setFontSize(9);

    this.subscription = from(this.inventories)
      .pipe(
        concatMap((inventory) =>
          from(Array(inventory.printCount)).pipe(
            concatMap(() => of(inventory).pipe(delay(delayTime)))
          )
        ),
        finalize(() =>
          timer(500)
            .pipe(takeWhile(() => this.isProcess))
            .subscribe(() => {
              doc.save(this.fileName);

              this.fileUrl = doc.output('datauristring');
              this.isLoading = false;
              this.percentComplete = 0;
              this.printService.resetInventory();
            })
        )
      )
      .subscribe((inventory) => {
        processedInventories++;
        this.percentComplete = (processedInventories / totalInventories) * 100;
        if (!inventory.fileUrl) return;

        const line1 = inventory.code.substring(0, 13);
        const line2 = inventory.code.substring(13, inventory.code.length);

        doc.addImage(
          inventory.fileUrl,
          currentX,
          currentY,
          columnWidth,
          columnHeight
        );
        doc.text(
          line1,
          currentX + columnGap - 5,
          currentY + columnHeight + lineText1
        );
        doc.text(
          line2,
          currentX + columnGap - 5,
          currentY + columnHeight + lineText2
        );
        currentX += columnWidth + columnGap;

        if (currentX + columnWidth <= doc.internal.pageSize.getWidth()) {
          doc.setLineDashPattern([3, 3], 0);
          doc.line(
            currentX - columnGap / 2,
            currentY + rowGap - columnDash,
            currentX - columnGap / 2,
            currentY + columnHeight + rowGap
          );

          columnCount++;
          if (columnCount === 1) {
            const dashedX = startX;
            const dashedY = currentY + rowGap + columnHeight + rowDash / 2;
            doc.setLineDashPattern([3, 3], 0);
            doc.line(
              dashedX,
              dashedY,
              doc.internal.pageSize.getWidth() - startX,
              dashedY
            );
          }
        }

        if (currentX + columnWidth > doc.internal.pageSize.getWidth()) {
          currentX = startX;
          currentY += columnHeight + columnGap + rowGap;
          rowCount++;
          columnCount = 0;
        }
        if (rowCount >= rowCountThreshold) {
          doc.addPage();
          currentX = startX;
          currentY = startY;
          rowCount = 0;
        }
      });
  }

  private async processPrintBarCode(): Promise<void> {
    const svg = document.querySelectorAll('svg');
    for (let i = 1; i < svg.length; i++) {
      this.inventories[i - 1].fileUrl = await this.convertSvgToJpg(svg[i]);
    }

    const doc = new jsPDF('p', 'px', 'a4'); // width 446.46
    const startX = 15;
    const startY = 15;
    const columnWidth = 128.82;
    const columnHeight = 40;
    const columnGap = 15;
    const rowGap = 20;
    const rowDash = 25;
    const rowCountThreshold = 10;

    const delayTime = 10;
    const totalInventories = this.inventories.reduce(
      (acc, inventory) => acc + inventory.printCount,
      0
    );

    let currentX = startX;
    let currentY = startY;
    let rowCount = 0;
    let columnCount = 0;
    let processedInventories = 0;
    doc.setFontSize(9);

    this.subscription = from(this.inventories)
      .pipe(
        concatMap((inventory) =>
          from(Array(inventory.printCount)).pipe(
            concatMap(() => of(inventory).pipe(delay(delayTime)))
          )
        ),
        finalize(() =>
          timer(500)
            .pipe(takeWhile(() => this.isProcess))
            .subscribe(() => {
              doc.save(this.fileName);

              this.fileUrl = doc.output('datauristring');
              this.isLoading = false;
              this.percentComplete = 0;
              this.printService.resetInventory();
            })
        )
      )
      .subscribe((inventory) => {
        processedInventories++;
        this.percentComplete = (processedInventories / totalInventories) * 100;
        if (!inventory.fileUrl) return;

        doc.addImage(
          inventory.fileUrl,
          currentX,
          currentY,
          columnWidth,
          columnHeight
        );
        doc.text(
          inventory.code,
          currentX + columnGap + 2,
          currentY + columnHeight + 4
        );
        currentX += columnWidth + columnGap;

        if (currentX + columnWidth <= doc.internal.pageSize.getWidth()) {
          doc.setLineDashPattern([3, 3], 0);
          doc.line(
            currentX - columnGap / 2,
            currentY - rowGap,
            currentX - columnGap / 2,
            currentY + columnHeight + columnGap - 3
          );

          columnCount++;
          if (columnCount === 1) {
            const dashedX = startX;
            const dashedY = currentY + columnHeight + rowDash / 2;
            doc.setLineDashPattern([3, 3], 0);
            doc.line(
              dashedX,
              dashedY,
              doc.internal.pageSize.getWidth() - startX,
              dashedY
            );
          }
        }

        if (currentX + columnWidth > doc.internal.pageSize.getWidth()) {
          currentX = startX;
          currentY += columnHeight + rowGap;
          rowCount++;
          columnCount = 0;
        }
        if (rowCount >= rowCountThreshold) {
          doc.addPage();
          currentX = startX;
          currentY = startY;
          rowCount = 0;
        }
      });
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
}
