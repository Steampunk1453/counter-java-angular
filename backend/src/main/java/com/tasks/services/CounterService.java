package com.tasks.services;

import com.tasks.exceptions.InternalException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class CounterService {

    Logger log = LoggerFactory.getLogger(CounterService.class);

    public static final int COUNTER_INCREMENT_TIME = 1000;

    public static final int COUNTER_INCREMENT = 1;

    private boolean flag;

    public ExecutorService executorService;

    public void execute(Integer start, Integer end) throws InterruptedException {
        flag = true;
        try {
            executorService = Executors.newFixedThreadPool(1);
            executorService.execute(() -> {
                log.info("Starting Counter");
                countingNumbers(start, end);
            });
        } finally {
            executorService.shutdown();
        }
    }

    public void stop() {
        log.info("Stopping Counter");
        this.flag = false;
    }

    public boolean isFlag() {
        return flag;
    }

    private void countingNumbers(Integer start, Integer end) {
        while (start <= end && flag) {
            log.debug("Counter number is: " + start);
            start += COUNTER_INCREMENT;
            try {
                Thread.sleep(COUNTER_INCREMENT_TIME);
            } catch (InterruptedException e) {
                throw new InternalException(e);
            }
        }
        log.info("Finishing Counter");
        this.flag = false;
    }

}
