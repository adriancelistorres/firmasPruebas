import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PDFDocument } from 'pdf-lib';

@Component({
  selector: 'app-firma',
  templateUrl: './firma.component.html',
  styleUrls: ['./firma.component.css'],
})
export class FirmaComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private context: CanvasRenderingContext2D | null = null;
  private isDrawing: boolean = false;
  private signaturePoints: { x: number; y: number }[] = [];

  ngOnInit() {
    this.context = this.canvas.nativeElement.getContext('2d');
    if (!this.context) {
      console.error('No se pudo obtener el contexto 2D del canvas.');
      return;
    }

    this.context.lineWidth = 2;
    this.context.strokeStyle = '#000000';

    // Agregar listeners para eventos táctiles
    this.canvas.nativeElement.addEventListener(
      'touchstart',
      this.onTouchStart.bind(this)
    );
    this.canvas.nativeElement.addEventListener(
      'touchmove',
      this.onTouchMove.bind(this)
    );
    this.canvas.nativeElement.addEventListener(
      'touchend',
      this.onTouchEnd.bind(this)
    );
  }

  onTouchStart(event: TouchEvent) {
    if (!this.context) return;
    const touch = event.touches[0];
    this.isDrawing = true;
    this.signaturePoints.push({
      x: touch.clientX - this.canvas.nativeElement.offsetLeft,
      y: touch.clientY - this.canvas.nativeElement.offsetTop,
    });
    this.context.beginPath();
  }

  onTouchMove(event: TouchEvent) {
    if (!this.context || !this.isDrawing) return;
    const touch = event.touches[0];
    const currentX = touch.clientX - this.canvas.nativeElement.offsetLeft;
    const currentY = touch.clientY - this.canvas.nativeElement.offsetTop;

    this.signaturePoints.push({ x: currentX, y: currentY });
    this.context.lineTo(currentX, currentY);
    this.context.stroke();
  }

  onTouchEnd() {
    this.isDrawing = false;
  }

  async createPdfWithImage() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();

    const signatureImage = await pdfDoc.embedPng(
      this.canvas.nativeElement.toDataURL()
    );
    const { width, height } = signatureImage.scale(0.5);

    page.drawImage(signatureImage, {
      x: 100,
      y: page.getHeight() - height - 100,
      width,
      height,
    });

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'firma.pdf';
    link.click();
  }

  clearCanvas() {
    if (!this.context) return;
    this.context.clearRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );
    this.signaturePoints = [];
  }

  downloadPdf() {
    if (!this.context) return;
    this.createPdfWithImage();
  }

  onMouseDown(event: MouseEvent) {
    if (!this.context) return;
    this.isDrawing = true;
    this.signaturePoints.push({
      x: event.clientX - this.canvas.nativeElement.offsetLeft,
      y: event.clientY - this.canvas.nativeElement.offsetTop,
    });
    this.context.beginPath();
  }

  onMouseMove(event: MouseEvent) {
    if (!this.context || !this.isDrawing) return;
    const currentX = event.clientX - this.canvas.nativeElement.offsetLeft;
    const currentY = event.clientY - this.canvas.nativeElement.offsetTop;

    this.signaturePoints.push({ x: currentX, y: currentY });
    this.context.lineTo(currentX, currentY);
    this.context.stroke();
  }

  onMouseUp() {
    this.isDrawing = false;
  }
}
