pragma solidity >=0.4.22 <0.9.0;

contract TodoList {
    uint256 public taskCount = 0;

    struct Task {
        uint256 id;
        string title;
        string content;
        bool completed;
    }

    mapping(uint256 => Task) public tasks;

    event TaskCreated(uint256 id, string content, bool completed);

    constructor() public {
        createTask("title 1", "This is task number 1");
        createTask("title 2", "This is task number 2");
    }

    function createTask(string memory _title, string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _title, _content, false);
        emit TaskCreated(taskCount, _content, false);
    }
}
