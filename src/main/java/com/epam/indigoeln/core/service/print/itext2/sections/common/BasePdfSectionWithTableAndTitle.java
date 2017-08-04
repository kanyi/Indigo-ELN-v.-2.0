package com.epam.indigoeln.core.service.print.itext2.sections.common;

import com.epam.indigoeln.core.service.print.itext2.model.common.SectionModel;
import com.epam.indigoeln.core.service.print.itext2.utils.CellFactory;
import com.epam.indigoeln.core.service.print.itext2.utils.TableFactory;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import one.util.streamex.StreamEx;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

public abstract class BasePdfSectionWithTableAndTitle<T extends SectionModel> extends AbstractPdfSection<T> {
    private PdfPTable titleTable;
    private PdfPTable contentTable;

    private static final int MIN_SPACE_FOR_CONTENT_ON_PAGE = 40;

    public BasePdfSectionWithTableAndTitle(T model) {
        super(model);
    }

    @Override
    protected List<PdfPTable> generateSectionElements(float width) {
        titleTable = generateTitleTable(width);
        contentTable = generateContentTable(width);

        PdfPTable table = TableFactory.createDefaultTable(1, width);
        table.setHeaderRows(1);

        PdfPCell title = CellFactory.getCommonCell(titleTable);
        title.setBorder(Rectangle.NO_BORDER);
        table.addCell(title);

        PdfPCell content = CellFactory.getCommonCell(contentTable);
        table.addCell(content);

        return StreamEx.of(table).filter(Objects::nonNull).toList();
    }

    protected abstract PdfPTable generateTitleTable(float width);

    protected abstract PdfPTable generateContentTable(float width);

    @Override
    public void addToDocument(Document document, PdfWriter writer) throws DocumentException {
        if (!isContentTableFittingPage(document, writer)) {
            document.newPage();
        }
        super.addToDocument(document, writer);
    }

    private boolean isContentTableFittingPage(Document document, PdfWriter writer) {
        float remainingPageHeight = writer.getVerticalPosition(true) - document.bottom();

        float titleTableHeight = Optional.of(titleTable).map(PdfPTable::getTotalHeight).orElse(0f);
        float contentTableHeaderHeight = Optional.of(contentTable).map(PdfPTable::getHeaderHeight).orElse(0f);
        float contentAvailableHeight = remainingPageHeight - titleTableHeight - contentTableHeaderHeight;

        return contentAvailableHeight >= MIN_SPACE_FOR_CONTENT_ON_PAGE;
    }
}
