package com.tasks.services;

import com.tasks.model.Task;
import com.tasks.model.TaskRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.List;

import static java.time.temporal.ChronoUnit.DAYS;

@Service
public class CleaningUpService {

    private final TaskRepository taskRepository;

    public CleaningUpService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    /**
     * Tasks that are not executed after 7 days should be automatically deleted.
     * <p>
     * This is scheduled to get fired everyday, at 02:00 (am).
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanTasks() {
        var date = getInactivityDate();
        List<Task> tasks = taskRepository.findAllByStorageLocationIsNullAndCreationDateBefore(date);
        tasks.forEach((t)-> {
            taskRepository.deleteById(t.getId());
        });
    }

    private Date getInactivityDate() {
        var today = Instant.now();
        var oneWeekAgo = today.minus(7, DAYS);
        return Date.from(oneWeekAgo);
    }

}
