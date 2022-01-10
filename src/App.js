
import { useEffect, useState } from 'react'
import { Button, Card, Col, Container, Form, Modal, Nav, Navbar, Row } from 'react-bootstrap';
import Web3 from 'web3'
import TodoList from './blockchain/build/contracts/TodoList.json'

const App = () => {
  const [account, setAccount] = useState();
  const [todoList, setTodoList] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false)
  const [todoTitle, setTodoTitle] = useState('')
  const [todoContent, setTodoContent] = useState('')

  const [contractInstance, setContractInstance] = useState(null)

  const [submitInProgress, setSubmitInProgress] = useState(false)

  const load = async () => {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
    const accounts = await web3.eth.requestAccounts();
    setAccount(accounts[0]);

    const tempContractInstance = new web3.eth.Contract(TodoList.abi, '0x378e111799EAe4BfB28aCcA298b046B7F44959Ae');


    const counter = await tempContractInstance.methods.taskCount().call();

    const tempList = []
    for (var i = 1; i <= counter; i++) {
      const todo = await tempContractInstance.methods.tasks(i).call();
      tempList.push(todo)
    }
    setTodoList(tempList)
    setContractInstance(tempContractInstance)
  }

  useEffect(() => {
    load()
    return () => {
      setAccount(null)
      setContractInstance(null)
    }
  }, [])

  const loadList = async () => {
    const counter = await contractInstance.methods.taskCount().call();
    const tempList = []
    for (var i = 1; i <= counter; i++) {
      const todo = await contractInstance.methods.tasks(i).call();
      tempList.push(todo)
    }
    setTodoList(tempList)
  }

  const handleCheck = (id) => {
    contractInstance.methods.toggleCompleted(id).send({ from: account }).then(result => loadList())
  }

  const onSubmit = (e) => {
    setSubmitInProgress(true)
    contractInstance.methods.createTask(todoTitle, todoContent).send({ from: account }).then(result => {
      setSubmitInProgress(false)
      setShowAddModal(false)
      setTodoTitle('')
      setTodoContent('')
      loadList()
    })
  }

  return (
    <>
      <Modal show={showAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Todo Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control value={todoTitle} onChange={(e) => setTodoTitle(e.target.value)} />
            </Form.Group>

            <Form.Group>
              <Form.Label>Content</Form.Label>
              <Form.Control value={todoContent} onChange={(e) => setTodoContent(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={onSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">TodoList</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={() => setShowAddModal(!showAddModal)}>Add</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link>{account}</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <Card className="my-3">
          <Card.Body>
            <Row>
              <Col md={3}>Id</Col>
              <Col md={3}>Title</Col>
              <Col md={3}>Content</Col>
              <Col md={3}>Completed</Col>
            </Row>
          </Card.Body>
        </Card>
        <Row>
          {todoList.map(item => (
            <Col md={12} className="mt-1">
              <Card>
                <Card.Body>
                  <Row>
                    <Col md={3}>{item.id}</Col>
                    <Col md={3}>{item.title}</Col>
                    <Col md={3}>{item.content}</Col>
                    <Col md={3}>
                      <Form.Check checked={item.completed} onClick={() => handleCheck(item.id)} />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default App;
