import React, { Component } from "react";
import TutorialDataService from "../services/tutorial.service";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import CsvDownload from 'react-json-to-csv';

export default class Tutorial extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.getTutorial = this.getTutorial.bind(this);
    this.updatePublished = this.updatePublished.bind(this);
    this.updateTutorial = this.updateTutorial.bind(this);
    this.deleteTutorial = this.deleteTutorial.bind(this);
    this.setOpen = this.setOpen.bind(this);
    this.setDownloadOldRecords = this.setDownloadOldRecords.bind(this);
    this.retrieveModifiedTutorials = this.retrieveModifiedTutorials.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleClickDownloadOldRecords = this.handleClickDownloadOldRecords.bind(this);
    this.handleCloseDownloadOld = this.handleCloseDownloadOld.bind(this);

    this.state = {
      open: false,
      downloadOldRecords: false,
      currentTutorial: {
        id: null,
        title: "",
        description: "",
        published: false
      },
      currentTutorialPrevVersion: {
        tutorial_id: null,
        title: "",
        description: "",
        published: false
      },
      message: "",
      modifiedData: {}
    };
  }

  componentDidMount() {
    this.getTutorial(this.props.match.params.id);
  }

  // componentDidUpdate() {
  //   this.getTutorial(this.props.match.params.id);
  // }

  onChangeTitle(e) {
    const title = e.target.value;

    this.setState(function (prevState) {
      return {
        // currentTutorialPrevVersion: {
        //   ...prevState.currentTutorialPrevVersion,
        //   description: this.state.currentTutorial.title
        // },
        currentTutorial: {
          ...prevState.currentTutorial,
          title: title
        }
      };
    });
  }

  onChangeDescription(e) {
    const description = e.target.value;

    this.setState(prevState => ({
      // currentTutorialPrevVersion: {
      //   ...prevState.currentTutorialPrevVersion,
      //   description: this.state.currentTutorial.description
      // },
      currentTutorial: {
        ...prevState.currentTutorial,
        description: description
      }
    }));
  }

  getTutorial(id) {
    TutorialDataService.get(id)
      .then(response => {
        console.log(response.data);
        this.setState({
          currentTutorialPrevVersion: {
            tutorial_id: response.data.id,
            title: response.data.title,
            description: response.data.description,
            published: response.data.published
          },
          currentTutorial: response.data,
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  updatePublished(status) {
    var data = {
      id: this.state.currentTutorial.id,
      title: this.state.currentTutorial.title,
      description: this.state.currentTutorial.description,
      published: status
    };

    console.log(this.state.currentTutorial)
    console.log(this.state.currentTutorialPrevVersion)

    TutorialDataService.saveBeforeUpdate(this.state.currentTutorialPrevVersion);

    TutorialDataService.update(this.state.currentTutorial.id, data)
      .then(response => {
        this.setState(prevState => ({
          currentTutorial: {
            ...prevState.currentTutorial,
            published: status
          }
        }));
      })
      .catch(e => {
        console.log(e);
      });
  }

  updateTutorial() {
    console.log(this.state.currentTutorial)
    console.log(this.state.currentTutorialPrevVersion)

    TutorialDataService.saveBeforeUpdate(this.state.currentTutorialPrevVersion);
    TutorialDataService.update(
      this.state.currentTutorial.id,
      this.state.currentTutorial
    )
      .then(response => {
        this.setState({
          message: "The tutorial was updated successfully!"
        });
      })
      .catch(e => {
        console.log(e);
      });
  }

  deleteTutorial() {
    TutorialDataService.delete(this.state.currentTutorial.id, this.state.currentTutorial)
      .then(response => {
        console.log(response.data);
        this.props.history.push('/tutorials')
      })
      .catch(e => {
        console.log(e);
      });
  }

  retrieveModifiedTutorials(id) {
    TutorialDataService.getOldVersions(id)
      .then(response => {
        this.setState({
          modifiedData: response.data
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  setOpen(dialogStatus) {
    this.setState({
      open: dialogStatus,
    })
  }

  setDownloadOldRecords(dialogStatus) {
    this.retrieveModifiedTutorials(this.state.currentTutorial.id);
    this.setState({
      downloadOldRecords: dialogStatus,
    })
  }

  handleClickOpen() {
    this.setOpen(true);
  }

  handleClose() {
    this.setOpen(false);
  }

  handleClickDownloadOldRecords() {
    this.setDownloadOldRecords(true);
  }

  handleCloseDownloadOld() {
    this.setDownloadOldRecords(false);
  }

  render() {
    const { currentTutorial, open, modifiedData, downloadOldRecords } = this.state;
    console.log(modifiedData);

    return (
      <div>
        {currentTutorial ? (
          <div>
            <div className="edit-form">
              <h4>Tutorial</h4>
              <form>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    value={currentTutorial.title}
                    onChange={this.onChangeTitle}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <input
                    type="text"
                    className="form-control"
                    id="description"
                    value={currentTutorial.description}
                    onChange={this.onChangeDescription}
                  />
                </div>

                <div className="form-group">
                  <label>
                    <strong>Status:</strong>
                  </label>
                  {currentTutorial.published ? "Published" : "Pending"}
                </div>
              </form>

              {currentTutorial.published ? (
                <button
                  className="m-3 btn btn-sm btn-info"
                  onClick={() => this.updatePublished(false)}
                >
                  UnPublish
                </button>
              ) : (
                <button
                  className="m-3 btn btn-sm btn-info"
                  onClick={() => this.updatePublished(true)}
                >
                  Publish
                </button>
              )}

              <button
                className="m-3 btn btn-sm btn-danger"
                onClick={this.handleClickOpen}
              >
                Delete
              </button>

              <button
                type="submit"
                className="m-3 btn btn-sm btn-success"
                onClick={this.updateTutorial}
              >
                Update
              </button>
              <button
                className="m-3 btn btn-sm btn-info"
                onClick={this.handleClickDownloadOldRecords}
              >
                Previous versions
              </button>
              <Dialog
                open={downloadOldRecords}
                onClose={this.handleCloseDeletedRecords}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Download list of all the versions of the tutorial?"}
                </DialogTitle>
                <DialogActions>
                  <Button onClick={this.handleCloseDownloadOld}>Close</Button>
                  <CsvDownload className="m-3 btn btn-sm btn-info" data={modifiedData} filename="Old version.csv" />
                </DialogActions>
              </Dialog>
              <p>{this.state.message}</p>
            </div>
            <div>
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
                  <Button onClick={this.deleteTutorial} autoFocus>
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>
            </div>

          </div>

        ) : (
          <div>
            <br />
            <p>Please click on a Tutorial...</p>
          </div>
        )}
      </div>
    );
  }
}
