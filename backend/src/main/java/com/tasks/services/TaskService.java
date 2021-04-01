package com.tasks.services;

import com.tasks.exceptions.InternalException;
import com.tasks.exceptions.NotFoundException;
import com.tasks.model.Task;
import com.tasks.model.TaskRepository;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    private final FileService fileService;

    private final CounterService counterService;

    public TaskService(TaskRepository taskRepository,
                       FileService fileService, CounterService counterService) {
        this.taskRepository = taskRepository;
        this.fileService = fileService;
        this.counterService = counterService;
    }

    public List<Task> listTasks() {
        return taskRepository.findAll();
    }

    public Task createTask(Task task) {
        task.setId(null);
        task.setCreationDate(new Date());
        return taskRepository.save(task);
    }

    public Task getTask(String taskId) {
        return get(taskId);
    }

    public Task update(String taskId, Task task) {
        Task existing = get(taskId);
        existing.setCreationDate(task.getCreationDate());
        existing.setName(task.getName());
        existing.setDescription(task.getDescription());
        return taskRepository.save(existing);
    }

    public void delete(String taskId) {
        taskRepository.deleteById(taskId);
    }

    public void executeTask(String taskId) {
        try {
            Task task = get(taskId);
            String storageLocation = fileService.storeResult(taskId);
            task.setStorageLocation(storageLocation);
            taskRepository.save(task);
        } catch (Exception e) {
            throw new InternalException(e);
        }
    }

    public FileSystemResource getTaskResult(String taskId) {
        String storageLocation = get(taskId).getStorageLocation();
        return fileService.getResult(storageLocation);
    }

    public void executeCountingTask(Integer start, Integer end) {
        try {
            counterService.execute(start, end);
        } catch (InterruptedException e) {
            throw new InternalException(e);
        }
    }

    public void stopCountingTask() {
        counterService.stop();
    }

    public boolean isFinish() {
        return counterService.isFlag();
    }

    private Task get(String taskId) {
        return taskRepository.findById(taskId).orElseThrow(NotFoundException::new);
    }

}
