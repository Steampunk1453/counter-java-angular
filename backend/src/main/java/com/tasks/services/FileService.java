package com.tasks.services;

import com.tasks.exceptions.InternalException;
import org.apache.commons.io.IOUtils;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;

@Component
public class FileService {

    public String storeResult(String taskId) throws IOException {
        URL url = Thread.currentThread().getContextClassLoader().getResource("backend.zip");
        if (url == null) {
            throw new InternalException("Zip file not found");
        }
        File outputFile = File.createTempFile(taskId, ".zip");
        outputFile.deleteOnExit();
        try (InputStream is = url.openStream();
             OutputStream os = new FileOutputStream(outputFile)) {
             IOUtils.copy(is, os);
        }
        return outputFile.getAbsolutePath();
    }

    public FileSystemResource getResult(String storageLocation) {
        var inputFile = new File(storageLocation);
        if (!inputFile.exists()) {
            throw new InternalException("File not generated yet");
        }
        return new FileSystemResource(inputFile);
    }

}
