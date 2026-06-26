import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """
    Custom canvas that performs a two-pass render of the PDF.
    This allows dynamically computing the total number of pages and printing
    'Page X of Y' in the footer, as well as applying a standardized header.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        # Save the state of the current page for the second pass
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#6b7280")) # Slate Gray
        
        # 1. Top Header (on all pages)
        self.setStrokeColor(colors.HexColor("#e5e7eb")) # Light Gray
        self.setLineWidth(0.5)
        # Margin is 36 points on each side (width of letter is 612 points)
        self.line(36, letter[1] - 40, letter[0] - 36, letter[1] - 40)
        self.drawString(36, letter[1] - 35, "NETGUARD // REAL-TIME NETWORK SECURITY INTELLIGENCE")
        
        # 2. Bottom Footer (on all pages)
        self.line(36, 45, letter[0] - 36, 45)
        self.drawString(36, 32, "NetGuard — Automated Network Anomaly Detection System")
        
        # Page numbering
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(letter[0] - 36, 32, page_text)
        self.restoreState()

def generate_session_report(alert_log: list, summary_stats: dict) -> io.BytesIO:
    """
    Creates an in-memory PDF report summarizing the live monitoring session.
    Features:
      - Clean cyber-defense themed layout.
      - Session statistics metrics cards (Analyzed, Anomalies, Safe %).
      - Threat history logs color-coded by severity.
      - Numbered footer and consistent header on every page.
    """
    buffer = io.BytesIO()
    
    # 72 points = 1 inch. Margins: left=0.5", right=0.5", top=0.75", bottom=0.75"
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=54,
        bottomMargin=54
    )
    
    styles = getSampleStyleSheet()
    
    # Define custom styling palette and fonts
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=colors.HexColor("#1e1b4b"), # Very dark blue
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#4b5563"), # Slate gray
        spaceAfter=15
    )
    
    section_title_style = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor("#1f2937"),
        spaceBefore=12,
        spaceAfter=8
    )
    
    body_style = ParagraphStyle(
        'ReportBodyText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#374151")
    )
    
    metric_label_style = ParagraphStyle(
        'MetricLbl',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=colors.HexColor("#4b5563"),
        alignment=1 # Center aligned
    )
    
    metric_val_style = ParagraphStyle(
        'MetricVal',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#2563eb"), # Blue
        alignment=1 # Center aligned
    )
    
    table_header_style = ParagraphStyle(
        'TableHeaderCell',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=colors.white
    )
    
    table_cell_style = ParagraphStyle(
        'TableCellText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#1f2937")
    )
    
    table_cell_bold_style = ParagraphStyle(
        'TableCellTextBold',
        parent=table_cell_style,
        fontName='Helvetica-Bold'
    )

    story = []
    
    # 1. Document Title
    story.append(Paragraph("NetGuard — Session Report", title_style))
    
    # 2. Timestamp and Meta Description
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    story.append(Paragraph(f"Analysis Report generated on {current_time} | Environment: Windows SOC Terminal", subtitle_style))
    
    # 3. Session Statistics Summary Grid (Packets Analyzed | Anomalies Detected | Safe Traffic %)
    packets_analyzed = summary_stats.get("packets_analyzed", 0)
    anomalies_detected = summary_stats.get("anomalies_detected", 0)
    
    if packets_analyzed > 0:
        safe_percentage = ((packets_analyzed - anomalies_detected) / packets_analyzed) * 100
    else:
        safe_percentage = 100.0

    # Format metric values
    packets_str = f"{packets_analyzed:,}"
    anomalies_str = f"{anomalies_detected:,}"
    safe_pct_str = f"{safe_percentage:.1f}%"
    
    # Add colored styles for values based on threat levels
    green_val_style = ParagraphStyle('GVal', parent=metric_val_style, textColor=colors.HexColor("#16a34a"))
    red_val_style = ParagraphStyle('RVal', parent=metric_val_style, textColor=colors.HexColor("#dc2626"))
    orange_val_style = ParagraphStyle('OVal', parent=metric_val_style, textColor=colors.HexColor("#ea580c"))
    
    anomaly_txt_style = red_val_style if anomalies_detected > 0 else green_val_style
    safe_txt_style = green_val_style if safe_percentage >= 90.0 else (orange_val_style if safe_percentage >= 70.0 else red_val_style)
    
    summary_table_content = [
        [
            Paragraph("PACKETS ANALYZED", metric_label_style),
            Paragraph("ANOMALIES ISOLATED", metric_label_style),
            Paragraph("SAFE TRAFFIC PERCENT", metric_label_style)
        ],
        [
            Paragraph(packets_str, metric_val_style),
            Paragraph(anomalies_str, anomaly_txt_style),
            Paragraph(safe_pct_str, safe_txt_style)
        ]
    ]
    
    # Total width of content = 612 - 72 = 540. ColWidths: 180, 180, 180
    summary_table = Table(summary_table_content, colWidths=[180, 180, 180])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f8fafc")), # slate-50
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#cbd5e1")), # slate-300
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")), # slate-200
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
    ]))
    
    story.append(Paragraph("Telemetry Metrics Summary", section_title_style))
    story.append(summary_table)
    story.append(Spacer(1, 15))
    
    # 4. Isolated Anomalies Table
    story.append(Paragraph("Security Alerts Log", section_title_style))
    
    if not alert_log:
        empty_reason_style = ParagraphStyle(
            'EmptyReason',
            parent=body_style,
            fontName='Helvetica-Oblique',
            textColor=colors.HexColor("#4b5563"),
            alignment=1
        )
        story.append(Spacer(1, 5))
        story.append(Paragraph("No anomalies were detected on the network during this session.", empty_reason_style))
    else:
        # Table Columns: Time | Status | Risk Score | Threat Description / Reason
        # ColWidths: Time(70) | Status(100) | Risk Score(80) | Reason(290) = 540 total width
        table_headers = [
            Paragraph("TIME", table_header_style),
            Paragraph("STATUS", table_header_style),
            Paragraph("RISK SCORE", table_header_style),
            Paragraph("THREAT ANALYSIS DETAIL", table_header_style)
        ]
        
        pdf_table_data = [table_headers]
        row_table_styles = []
        
        for index, alert in enumerate(alert_log):
            time_str = alert.get("time", "")
            status_lbl = alert.get("label", "Unknown")
            risk_score_val = f"{alert.get('risk_score', 0.0):.1f} / 100"
            reason_str = alert.get("reason", "")
            severity_color = alert.get("color", "green")
            
            # Map colors to highly legible pastel values for report row backgrounds
            text_color = colors.HexColor("#1f2937")
            bg_color = colors.HexColor("#f8fafc")
            
            if severity_color == "red":
                bg_color = colors.HexColor("#fee2e2") # light red
                text_color = colors.HexColor("#991b1b")
            elif severity_color == "orange":
                bg_color = colors.HexColor("#ffedd5") # light orange
                text_color = colors.HexColor("#9a3412")
            elif severity_color == "yellow":
                bg_color = colors.HexColor("#fef9c3") # light yellow
                text_color = colors.HexColor("#854d0e")
            elif severity_color == "green":
                bg_color = colors.HexColor("#dcfce7") # light green
                text_color = colors.HexColor("#166534")
                
            cell_text_style = ParagraphStyle(f'CellTxt_{index}', parent=table_cell_style, textColor=text_color)
            cell_bold_style = ParagraphStyle(f'CellBold_{index}', parent=table_cell_bold_style, textColor=text_color)
            
            pdf_table_data.append([
                Paragraph(time_str, cell_text_style),
                Paragraph(status_lbl, cell_bold_style),
                Paragraph(risk_score_val, cell_bold_style),
                Paragraph(reason_str, cell_text_style)
            ])
            
            # Add padding and background for each row dynamically
            row_idx = index + 1
            row_table_styles.append(('BACKGROUND', (0, row_idx), (-1, row_idx), bg_color))
            row_table_styles.append(('TOPPADDING', (0, row_idx), (-1, row_idx), 6))
            row_table_styles.append(('BOTTOMPADDING', (0, row_idx), (-1, row_idx), 6))
            
        alert_table = Table(pdf_table_data, colWidths=[70, 100, 80, 290])
        
        # Base table styling configuration
        base_style = [
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1e293b")), # slate-800
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, 0), 8),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
        ]
        
        base_style.extend(row_table_styles)
        alert_table.setStyle(TableStyle(base_style))
        story.append(alert_table)
        
    # Build document using the NumberedCanvas
    doc.build(story, canvasmaker=NumberedCanvas)
    
    # Rewind buffer
    buffer.seek(0)
    return buffer
