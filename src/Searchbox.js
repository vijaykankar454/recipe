import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Alert,
  Spinner,
  Modal,
  Form,
  Container,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import axios from "axios";
import Result from "./component/Result/Result";

export default class Searchbox extends Component {
  state = {
    search: "",
    submit: false,
    error: false,
    dataList: [],
    errorvalid: false,
    lastsearch: [],
    health: "peanut-free",
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
    this.setState({ errorvalid: false });
  };

  submitFromHandler = async (event) => {
    event.preventDefault();

    const APP_KEY = "7e10ad75f7308965488c0819afa460e7";
    const APP_ID = "6fa19908";

    if (this.state.search) {
      this.setState({ submit: true });

      const getsearch = [
        ...this.state.lastsearch,
        { keyword: this.state.search, healthkeyword: this.state.health },
      ];
      if (getsearch.length == 6) {
        getsearch.splice(getsearch.length-1, 1);
      }

      this.setState({ lastsearch: getsearch });
      let healthurl = "";
      if (this.state.health) {
        healthurl = `&health=${this.state.health}`;
      }

      await axios
        .get(
          `https://api.edamam.com/search?q=${this.state.search}&app_id=${APP_ID}&app_key=${APP_KEY}&from=0&to=10&calories=591-722${healthurl}`
        )
        .then((response) => {
          const dataArr = [];
          for (let key in response.data.hits) {
            const getrecData = response.data.hits[key];
            dataArr.push({
              recipename: getrecData.recipe.label,
              recipenameid: key,
              recipenameimg: getrecData.recipe.image,
              source: getrecData.recipe.source,
            });
          }
          if (dataArr.length > 0) {
            this.setState({ dataList: dataArr });
          }
          this.setState({ submit: false });
        })
        .catch((error) => {
          this.setState({ error: true });
        });
      this.setState({ search: "",  submit: false });
    } else {
      this.setState({ errorvalid: true });
    }
  };

  render() {
    let lastallearch = null;
    let lasttitle = null;
    let mainTitle = "none";
    if (this.state.lastsearch.length > 0 && this.state.lastsearch) {
      mainTitle =
        this.state.lastsearch[this.state.lastsearch.length - 1].keyword +
        "/" +
        this.state.lastsearch[this.state.lastsearch.length - 1].healthkeyword;
      lasttitle = <b>{`Last ${this.state.lastsearch.length} transaction`}</b>;
      lastallearch = this.state.lastsearch.map((data) => {
        return (
          <div>
            {data.keyword}/{data.healthkeyword}
          </div>
        );
      });
    }

    let recipeList = "null";

    if (this.state.dataList.length > 0 && this.state.dataList) {
      recipeList = <Result childdataList={this.state.dataList}></Result>;
    } else {
      recipeList = "No Record Found";
    }

    return (
      <div className="App">
        <Modal
          size="lg"
          show={this.state.error}
          onHide={() => this.setState({ error: false })}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">Error</Modal.Title>
          </Modal.Header>
          <Modal.Body>Server Error</Modal.Body>
        </Modal>
        <Container>
          <Row>
            <Col>
              Last Search Keyword: <b>{mainTitle}</b> <br></br>
              <Form onSubmit={this.submitFromHandler}>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>Keyword</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Search Keyword"
                    value={this.state.search}
                    name="search"
                    onChange={this.handleChange}
                  />
                </Form.Group>
                {this.state.errorvalid ? (
                  <Alert key="0" variant="danger">
                    Please Enter Search Keyword
                  </Alert>
                ) : null}
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>Health</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="enter health"
                    value={this.state.health}
                    name="health"
                    onChange={this.handleChange}
                  />
                </Form.Group>

                <br></br>

                {this.state.submit ? (
                  <Spinner animation="border" />
                ) : (
                  <Button variant="primary" type="submit">
                    Submit
                  </Button>
                )}
                <br></br>
              </Form>
              <br></br>
              {lasttitle}
              {lastallearch}
            </Col>

            <Col>{recipeList}</Col>
          </Row>
        </Container>
      </div>
    );
  }
}
