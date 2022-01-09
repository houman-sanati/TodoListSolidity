
import { useEffect, useState } from 'react'
import { Card, Col, Container, Nav, Navbar, Row } from 'react-bootstrap';
import Web3 from 'web3'
import TodoList from './blockchain/build/contracts/TodoList.json'

const App = () => {
  const [account, setAccount] = useState();
  const [todoList, setTodoList] = useState([]);

  const load = async () => {
    const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
    const accounts = await web3.eth.requestAccounts();
    setAccount(accounts[0]);

    const contractInstance = new web3.eth.Contract(TodoList.abi, '0x87CcC9473521043558Cd4Cb99c366687Af5857D2');


    const counter = await contractInstance.methods.taskCount().call();

    const tempList = []
    for (var i = 1; i <= counter; i++) {
      const todo = await contractInstance.methods.tasks(i).call();
      tempList.push(todo)
    }
    setTodoList(tempList)
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">TodoList</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link>Todos</Nav.Link>
            <Nav.Link>Add</Nav.Link>
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
              <Col md={4}>Id</Col>
              <Col md={4}>Content</Col>
              <Col md={4}>Completed</Col>
            </Row>
          </Card.Body>
        </Card>
        <Row>
          {todoList.map(item => (
            <Col md={12} className="mt-1">
              <Card>
                <Card.Body>
                  <Row>
                    <Col md={4}>{item.id}</Col>
                    <Col md={4}>{item.content}</Col>
                    <Col md={4}>{item.completed ? '✔' : '❌'}</Col>
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
