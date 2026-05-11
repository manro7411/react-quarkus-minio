package com.api.proposal.service;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ProposalStorageService {

    public String uploadProposalPdf(String fileName, byte[] pdfBytes) {
        /*
         * Temporary version for local test.
         * ตอนนี้ยังไม่ได้ upload เข้า MinIO จริง
         * ใช้เพื่อให้ backend compile และ test flow Containerfile.proposal-generator-generator ได้ก่อน
         */

        System.out.println("Generated Containerfile.proposal-generator file: " + fileName);
        System.out.println("Generated Containerfile.proposal-generator size: " + pdfBytes.length + " bytes");

        return "/api/public/proposals/download/" + fileName;
    }
}