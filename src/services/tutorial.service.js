import http from "../http-common";

class TutorialDataService {
  getAll() {
    return http.get("/tutorials");
  }

  get(id) {
    return http.get(`/tutorials/${id}`);
  }

  create(data) {
    return http.post("/tutorials", data);
  }

  deletedRecords(data) {
    return http.post(`/deletedRecords`, data);
  }

  getAllDeletedRecords() {
    return http.get(`/deletedRecords/getDeletedRecords`);
  }

  update(id, data) {
    return http.put(`/tutorials/${id}`, data);
  }

  saveBeforeUpdate(data){
    return http.post("/modifiedRecords", data);
  }

  getOldVersions(id){
    return http.get(`/modifiedRecords/${id}`);
  }

  delete(id, data) {
    this.deletedRecords(data);
    return http.delete(`/tutorials/${id}`, data);
  }

  deleteAll() {
    return http.delete(`/tutorials`);
  }

  findByTitle(title) {
    return http.get(`/tutorials?title=${title}`);
  }
}

export default new TutorialDataService();