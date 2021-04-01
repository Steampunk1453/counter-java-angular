package com.tasks.controllers;

import com.tasks.model.Task;
import com.tasks.services.TaskService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

import static org.springframework.http.HttpStatus.OK;
import static org.springframework.http.MediaType.APPLICATION_OCTET_STREAM;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    public static final String FILENAME = "backend.zip";

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/")
    public List<Task> listTasks() {
        return taskService.listTasks();
    }

    @PostMapping("/")
    public Task createTask(@RequestBody @Valid Task task) {
        return taskService.createTask(task);
    }

    @GetMapping("/{taskId}")
    public Task getTask(@PathVariable String taskId) {
        return taskService.getTask(taskId);
    }

    @PutMapping("/{taskId}")
    public Task updateTask(@PathVariable String taskId, @RequestBody @Valid Task task) {
        return taskService.update(taskId, task);
    }

    @DeleteMapping("/{taskId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(@PathVariable String taskId) {
        taskService.delete(taskId);
    }

    @PostMapping("/{taskId}/execute")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void executeTask(@PathVariable String taskId) {
        taskService.executeTask(taskId);
    }

    @GetMapping("/{taskId}/result")
    public ResponseEntity<FileSystemResource> getResult(@PathVariable String taskId) {
        FileSystemResource file = taskService.getTaskResult(taskId);
        var respHeaders = new HttpHeaders();
        respHeaders.setContentType(APPLICATION_OCTET_STREAM);
        respHeaders.setContentDispositionFormData("attachment", FILENAME);
        return new ResponseEntity<>(file, respHeaders, OK);
    }

    @GetMapping("/counter/{start}/{end}")
    public void executeCountingTask(@PathVariable Integer start, @PathVariable Integer end) {
        taskService.executeCountingTask(start, end);
    }

    @GetMapping("/counter/stop")
    public void stopCountingTask() {
        taskService.stopCountingTask();
    }

    @GetMapping("/counter/isFinish")
    public boolean isFinishCountingTask() {
        return taskService.isFinish();
    }

}
