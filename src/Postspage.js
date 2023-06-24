import React, { useState, useEffect } from "react";
import axios from "axios";
import { ListGroup, Container, Card, Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";
import { BsTrashFill } from "react-icons/bs";
// import apirequest from "./apirequest";

const Postspage = () => {
  const API_URL = "http://localhost:7000/postdata";
  const [listitem, setlistitem] = useState([]);
  const [productname, setproductName] = useState("");
  const [itemcheck, setitemchecked] = useState();
  const [itemdelete, setitemdelete] = useState();

  const axiosdata = () => {
    axios.get(API_URL).then((response) => {
      setlistitem(response.data);
      const datachecktrue = response.data.map((x) =>
        x.checked ? false : true
      );
      const checkedlist = datachecktrue.filter((x) => x === false).length;
      setitemchecked(checkedlist);
    });
  };

  useEffect(() => {
    const items = async () => {
      axiosdata();
    };
    (async () => await items())();

    // const items = async () => {
    //   try {
    //     const apidata = await fetch(API_URL);
    //     if (!apidata) throw Error("The data is not loaded fine!");
    //     const listItems = await apidata.json();
    //     setlistitem(listItems);
    //   } catch (err) {}
    // };
    // (async () => await items())();
  }, []);

  const handleproduct = async (Listitem) => {
    const id = listitem.length ? listitem[listitem.length - 1].id + 1 : 1;
    const dataid = { id, Listitem, checked: false };
    const dataprodid = [...listitem, dataid];
    setlistitem(dataprodid);
    console.log("Submitted", dataprodid);

    axios.post(API_URL, dataid).then((response) => {
      console.log(response.data);
    });

    // const apipost = {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(dataid),
    // };
    // const apipostrequest = await fetch(API_URL, apipost);
    // console.log(apipostrequest);
  };

  const handleproductform = (e) => {
    e.preventDefault();
    handleproduct(productname);
    setproductName("");
  };

  const itemchecked = async (id) => {
    const prodlist = listitem.map((x) =>
      x.id === id ? { ...x, checked: !x.checked } : x
    );
    setlistitem(prodlist);
    const datachecktruelist = prodlist.map((x) => (x.checked ? false : true));
    const checkedlist = datachecktruelist.filter((x) => x === false).length;
    const list = prodlist.filter((x) => x.id === id);

    const datalist = `${API_URL}/${id}`;
    const userData = {
      id: list[0].id,
      checked: list[0].checked,
      Listitem: list[0].Listitem,
    };
    axios.patch(datalist, userData).then((response) => {
      console.log(response.data);
      setitemchecked(checkedlist);
    });

    // const apipost = {
    //   method: "PATCH",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     id: list[0].id,
    //     checked: list[0].checked,
    //     Listitem: list[0].Listitem,
    //   }),
    // };

    // const apirequesturl = `${API_URL}/${id}`;
    // const requesturlpost = await fetch(apirequesturl, apipost);
    // console.log(requesturlpost);
    // setitemchecked(checkedlist);
  };

  const itemcheckedremove = (id) => {
    const deleterecord = listitem.filter((x) => x.id === id);
    const takerecord = deleterecord[0].checked === true;
    console.log(takerecord);
    setitemdelete(takerecord);
    console.log(itemdelete);
    if (deleterecord[0].checked === true) {
      axiosdata();
    }
  };

  const itemdeleterow = (id) => {
    const removerowdata = listitem.filter((x) => x.id !== id);
    setlistitem(removerowdata);
    const dataurl = `${API_URL}/${id}`;
    axios.delete(dataurl, removerowdata).then((response) => {
      console.log(response.data);
    });
    itemcheckedremove(id);
  };

  // useMemo and Usecallback is both are similar but the usememo is only returns the memozied values and the usecallback is only returns the memozied functions.

  return (
    <>
      <div className="mt-5 px-3 py-4">
        <h3 className="h3 display-6">
          <b>POST ITEMS</b>
        </h3>
        <div className="mt-5">
          <Container className="p-4">
            <Row>
              <Col md="4" className="marginauto">
                <Form onSubmit={handleproductform}>
                  <Form.Group>
                    <Form.Label>
                      <h6 className="h6 display-7">Enter the post details:</h6>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter the details"
                      name="Listitem"
                      value={productname}
                      onChange={(e) => {
                        setproductName(e.target.value);
                      }}
                    />
                  </Form.Group>
                  <br />
                  <Button
                    variant="primary"
                    type="submit"
                    className="postsubmit"
                    disabled={!productname}
                  >
                    Add
                  </Button>
                </Form>
              </Col>
            </Row>
            <br />
            <br />
            <Row>
              <Col md="5" className="marginauto">
                <Card className="Cardspacelist">
                  <Card.Body>
                    <Card.Title>Total List Items</Card.Title>
                    <Card.Text>{listitem.length}</Card.Text>
                  </Card.Body>
                </Card>
                <Card className="Cardspacelist1">
                  <Card.Body>
                    <Card.Title>Total selected List Items</Card.Title>
                    <Card.Text>{itemcheck}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <br />
            <br />
            <Row>
              <Col md="4" className="marginauto">
                <Card>
                  {listitem.map((list) => (
                    <ListGroup variant="flush" key={list.id}>
                      <ListGroup.Item>
                        <span onClick={() => itemchecked(list.id)}>
                          {list.checked === false ? (
                            <FcLikePlaceholder />
                          ) : (
                            <FcLike />
                          )}
                        </span>
                        {list.Listitem}
                        <span
                          className="BsTrashFill_class"
                          onClick={() => itemdeleterow(list.id)}
                        >
                          <BsTrashFill />
                        </span>
                      </ListGroup.Item>
                    </ListGroup>
                  ))}
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
};

export default Postspage;
