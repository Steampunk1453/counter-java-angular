package com.tasks.services

import com.tasks.exceptions.InternalException
import com.tasks.exceptions.NotFoundException
import com.tasks.model.Task
import com.tasks.model.TaskRepository
import org.springframework.core.io.FileSystemResource
import spock.lang.Specification
import spock.lang.Subject

class TaskServiceSpec extends Specification {

    TaskRepository repository = Mock()

    FileService fileService = Mock()

    CounterService counterService = Mock()

    @Subject
    TaskService taskService = new TaskService(repository, fileService, counterService)

    def "should create a new task and return task created"() {
        given:
            Task task = createTask()
            Task newTask = new Task()
            task.id = UUID.randomUUID().toString()
            task.name = "task"
            task.description = "description task"
            task.creationDate = new Date()
        when:
            Task result = taskService.createTask(newTask)
        then:
            1 * repository.save(_ as Task) >> task
            result.id == task.id
            result.name == task.name
            result.description == task.description
            result.creationDate == task.creationDate
            result.storageLocation == null
    }

    def "should update previous task and return task updated"() {
        given:
            Task oldTask = createTask()
            String taskId = oldTask.id
            Task newTask = new Task();
            newTask.name = "task1"
            newTask.description = "description1"
            newTask.creationDate = oldTask.getCreationDate()
        when:
            Task result = taskService.update(taskId, newTask)
        then:
            1 * repository.findById(_ as String) >> Optional.of(oldTask)
            1 * repository.save(_ as Task) >> oldTask
            result.id == taskId
            result.name == newTask.name
            result.creationDate == newTask.creationDate
            result.storageLocation == null
    }

    def "should successfully execute a task and dont throw InternalException"() {
        given:
            Task task = createTask()
            String taskId = UUID.randomUUID().toString()
            String storageLocation = "path"
        when:
            taskService.executeTask(taskId)
        then:
            1 * repository.findById(_ as String) >> Optional.of(task)
            1 * fileService.storeResult(_ as String) >> storageLocation
            1 * repository.save(_ as Task) >> Optional.of(task) >> task
    }

    def 'should throw InternalException when execute a task throws IOException'() {
        given:
            String taskId = UUID.randomUUID().toString()
        when:
            taskService.executeTask(taskId)
        then:
            thrown(InternalException)
    }

    def 'should throw InternalException when execute a task throws NotFoundException'() {
        given:
            String taskId = UUID.randomUUID().toString()
        when:
            taskService.executeTask(taskId)
        then:
            1 * repository.findById(_ as String) >> NotFoundException
            0 * fileService.storeResult(_ as Task, _ as URL)
            thrown(InternalException)
    }

    def "should get a task result with a file"() {
        given:
            String taskId = UUID.randomUUID().toString()
            Task task = createTask()
            task.storageLocation = "storageLocation"
            File inputFile = new File("storageLocation")
            FileSystemResource fileSystemResource = new FileSystemResource(inputFile)

        when:
            FileSystemResource result = taskService.getTaskResult(taskId)
        then:
            1 * repository.findById(_ as String) >> Optional.of(task)
            1 * fileService.getResult(_ as String) >> fileSystemResource
            result != null
    }

    def "should execute counting task and dont throw InternalException"() {
        given:
            Integer start = 1
            Integer end = 10
        when:
           taskService.executeCountingTask(start, end)
        then:
            1 * counterService.execute(start, end)
    }

    private static Task createTask() {
        Task task = new Task();
        task.id = UUID.randomUUID().toString()
        task.name = "task"
        task.description = "description"
        task.creationDate = new Date()
        return task
    }

}
