package com.api.proposal.service;

import com.api.proposal.dto.GenerateProposalRequest;
import jakarta.enterprise.context.ApplicationScoped;
import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;

import java.io.InputStream;
import java.net.URL;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@ApplicationScoped
public class ProposalJasperService {

    private static final String TEMPLATE_PATH = "/templates/love-Containerfile.proposal-generator.jrxml";
    private static final String BACKGROUND_IMAGE_PATH = "/images/Containerfile.proposal-generator-bg.png";
    private static final DateTimeFormatter REQUEST_DATE_FORMAT =
            DateTimeFormatter.ofPattern("ddMMyyyy");

    public byte[] generatePdf(GenerateProposalRequest request) {
        try {
            InputStream templateStream = loadTemplate();
            URL backgroundUrl = loadBackgroundImage();

            JasperReport report = JasperCompileManager.compileReport(templateStream);

            Map<String, Object> params = buildParams(request, backgroundUrl);

            JasperPrint print = JasperFillManager.fillReport(
                    report,
                    params,
                    new JREmptyDataSource()
            );

            return JasperExportManager.exportReportToPdf(print);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Containerfile.proposal-generator PDF", e);
        }
    }

    private InputStream loadTemplate() {
        InputStream templateStream = getClass().getResourceAsStream(TEMPLATE_PATH);

        if (templateStream == null) {
            throw new IllegalStateException("Template not found: " + TEMPLATE_PATH);
        }

        return templateStream;
    }

    private URL loadBackgroundImage() {
        URL backgroundUrl = getClass().getResource(BACKGROUND_IMAGE_PATH);

        if (backgroundUrl == null) {
            throw new IllegalStateException(
                    "Background image not found: " + BACKGROUND_IMAGE_PATH
            );
        }

        return backgroundUrl;
    }

    private Map<String, Object> buildParams(
            GenerateProposalRequest request,
            URL backgroundUrl
    ) {
        Map<String, Object> params = new HashMap<>();

        String acceptedDate = valueOrDefault(request.acceptedDate, "");

        params.put("BACKGROUND_IMAGE", backgroundUrl.toString());
        params.put("ASKED_BY", valueOrDefault(request.askedBy, "-"));
        params.put("ACCEPTED_BY", valueOrDefault(request.acceptedBy, "-"));
        params.put("ACCEPTED_DATE_DISPLAY", formatDdMmYyyyToDisplay(acceptedDate));
        params.put("ACCEPTED_DAY", formatDay(acceptedDate));
        params.put("ACCEPTED_MONTH", formatMonth(acceptedDate));
        params.put("ACCEPTED_YEAR", formatYear(acceptedDate));
        params.put("DOCUMENT_CODE", buildDocumentCode(request));

        return params;
    }

    private LocalDate parseAcceptedDate(String value) {
        return LocalDate.parse(value, REQUEST_DATE_FORMAT);
    }

    private String formatDdMmYyyyToDisplay(String value) {
        try {
            LocalDate date = parseAcceptedDate(value);

            return date.format(
                    DateTimeFormatter.ofPattern("dd/MM/yyyy", Locale.ENGLISH)
            );
        } catch (Exception e) {
            return valueOrDefault(value, "-");
        }
    }

    private String formatDay(String value) {
        try {
            LocalDate date = parseAcceptedDate(value);
            return String.format("%02d", date.getDayOfMonth());
        } catch (Exception e) {
            return "";
        }
    }

    private String formatMonth(String value) {
        try {
            LocalDate date = parseAcceptedDate(value);
            return String.format("%02d", date.getMonthValue());
        } catch (Exception e) {
            return "";
        }
    }

    private String formatYear(String value) {
        try {
            LocalDate date = parseAcceptedDate(value);
            return String.valueOf(date.getYear());
        } catch (Exception e) {
            return "";
        }
    }

    private String buildDocumentCode(GenerateProposalRequest request) {
        String siteKey = valueOrDefault(request.siteKey, "site")
                .toUpperCase()
                .replaceAll("[^A-Z0-9]", "-");

        String date = valueOrDefault(request.acceptedDate, "00000000");

        return "PROPOSAL-" + siteKey + "-" + date;
    }

    private String valueOrDefault(String value, String defaultValue) {
        return value == null || value.isBlank() ? defaultValue : value;
    }
}