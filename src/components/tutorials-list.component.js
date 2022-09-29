import { Component } from "react";
import * as React from "react";
import TutorialDataService from "../services/tutorial.service";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import CsvDownload from 'react-json-to-csv';

export default class TutorialsList extends Component {

  constructor(props) {
    super(props);
    this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
    this.retrieveTutorials = this.retrieveTutorials.bind(this);
    this.removeAllTutorialsConfirm = this.removeAllTutorialsConfirm.bind(this);
    this.refreshList = this.refreshList.bind(this);
    this.setActiveTutorial = this.setActiveTutorial.bind(this);
    this.searchTitle = this.searchTitle.bind(this);
    this.setOpen = this.setOpen.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleClickOpenDeletedRecords = this.handleClickOpenDeletedRecords.bind(this);
    this.handleCloseDeletedRecords = this.handleCloseDeletedRecords.bind(this);
    this.retrieveDeletedTutorials = this.retrieveDeletedTutorials.bind(this);

    this.state = {
      open: false,
      deletedData: {},
      openDeletedRecords:false,
      tutorials: [],
      currentTutorial: null,
      currentIndex: -1,
      searchTitle: ""
    };
  }

  componentDidMount() {
    this.retrieveTutorials();
  }

  onChangeSearchTitle(e) {
    const searchTitle = e.target.value;

    this.setState({
      searchTitle: searchTitle
    });
  }

  retrieveTutorials() {
    TutorialDataService.getAll()
      .then(response => {
        this.setState({
          tutorials: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  retrieveDeletedTutorials() {
    TutorialDataService.getAllDeletedRecords()
      .then(response => {
        this.setState({
          deletedData: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  refreshList() {
    this.retrieveTutorials();
    this.setState({
      currentTutorial: null,
      currentIndex: -1
    });
  }

  setActiveTutorial(tutorial, index) {
    this.setState({
      currentTutorial: tutorial,
      currentIndex: index
    });
  }

  setOpen(dialogStatus) {
    this.setState({
      open: dialogStatus,
    })
  }

  setOpenDeletedRecords(dialogStatus) {
    this.retrieveDeletedTutorials();
    this.setState({
      openDeletedRecords: dialogStatus,
    })
  }


  removeAllTutorialsConfirm() {
    TutorialDataService.deleteAll()
      .then(response => {
        console.log(response.data);
        this.refreshList();
        this.handleClose();
      })
      .catch(e => {
        console.log(e);
      });
  }

  searchTitle() {
    this.setState({
      currentTutorial: null,
      currentIndex: -1
    });

    TutorialDataService.findByTitle(this.state.searchTitle)
      .then(response => {
        this.setState({
          tutorials: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  handleClickOpen() {
    this.setOpen(true);
  }

  handleClose () {
    this.setOpen(false);
  }

  handleClickOpenDeletedRecords() {
    this.setOpenDeletedRecords(true);
  }

  handleCloseDeletedRecords() {
    this.setOpenDeletedRecords(false);
  }

  render() {
    const { searchTitle, tutorials, currentTutorial, currentIndex, open, openDeletedRecords, deletedData } = this.state;

    return (
      <div className="list row">
        <div className="col-md-8">
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by title"
              value={searchTitle}
              onChange={this.onChangeSearchTitle}
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={this.searchTitle}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <h4>Tutorials List</h4>

          <ul className="list-group">
            {tutorials &&
              tutorials.map((tutorial, index) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex ? "active" : "")
                  }
                  onClick={() => this.setActiveTutorial(tutorial, index)}
                  key={index}
                >
                  {tutorial.title}
                </li>
              ))}
          </ul>

          {/* <button
            className="m-3 btn btn-sm btn-danger"
            onClick={this.handleClickOpen}
          >
            Delete All
          </button> */}
          <button
            className="m-3 btn btn-sm btn-info"
            onClick={this.handleClickOpenDeletedRecords}
          >
            View deleted tutorials
          </button>
        </div>
        <Dialog
        open={open}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to Delete?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={this.handleClose}>Close</Button>
          <Button onClick={this.removeAllTutorialsConfirm} autoFocus>
          Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeletedRecords}
        onClose={this.handleCloseDeletedRecords}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Do you want to download list of deleted tutorials?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={this.handleCloseDeletedRecords}>Close</Button>
          <CsvDownload className="m-3 btn btn-sm btn-info" data={deletedData} filename="Deleted Tutorials.csv"/>
        </DialogActions>
      </Dialog>

        <div className="col-md-6">
          {currentTutorial ? (
            <div>
              <h4>Tutorial</h4>
              <div>
                <label>
                  <strong>Title:</strong>
                </label>{" "}
                {currentTutorial.title}
              </div>
              <div>
                <label>
                  <strong>Description:</strong>
                </label>{" "}
                {currentTutorial.description}
              </div>
              <div>
                <label>
                  <strong>Status:</strong>
                </label>{" "}
                {currentTutorial.published ? "Published" : "Pending"}
              </div>

              <Link
                to={"/tutorials/" + currentTutorial.id}
                className="badge badge-warning"
              >
                Edit
              </Link>
            </div>
          ) : (
            <div>
              <br />
              <p>Please click on a Tutorial...</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
