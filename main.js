let limitStart = 0;
let limitEnd = 6;
let allData = [];

const apiData = {
  page: 1,
  limit: 6,
  async getData() {
    const res = await fetch(`https://mamtn011.github.io/our_garden/db.json`);
    const data = await res.json();
    return data;
  },
};
const UI = {
  selectDom() {
    const collections = document.querySelector(".grid");
    const container = document.querySelector(".popup");
    const pages = document.querySelector(".pages");
    const first = document.querySelector(".first");
    const prev = document.querySelector(".prev");
    const next = document.querySelector(".next");
    const last = document.querySelector(".last");

    return {
      collections,
      container,
      pages,
      first,
      prev,
      next,
      last,
    };
  },
  galleryShowToUI(datas) {
    const { collections } = this.selectDom();
    collections.textContent = "";
    let elm = "";
    datas.forEach((data) => {
      elm += `<div class="content" data-id = "${data.id}">
      <img src="img/${data.src}" class="img" />
      <h3 class="title">${data.title}</h3>
    </div>`;
    });
    collections.insertAdjacentHTML("afterbegin", elm);
  },
  setAttributeDisabled(elm1, elm2) {
    elm1.setAttribute("disabled", "desabled");
    elm2.setAttribute("disabled", "desabled");
  },
  removeAttributeDisabled(elm1, elm2) {
    elm1.removeAttribute("disabled");
    elm2.removeAttribute("disabled");
  },
  getTotalOfData() {
    apiData.page = 1;
    apiData.limit = 1000;
    //const data = await apiData.getData();
    const total = allData.length;
    return total;
  },
  handlePopup() {
    const { container, collections } = this.selectDom();
    const datas = allData;
    collections.addEventListener("click", (evt) => {
      if (
        evt.target.classList.contains("img") ||
        evt.target.classList.contains("title")
      ) {
        const id = evt.target.parentElement.dataset.id;
        const data = datas.find((data) => data.id == id);
        let elm = "";
        elm = `<div id="Modal" class="modal">
      <!-- Modal content -->
      <div class="modal-content">
        <span class="close">&times;</span>
        <div
          style="
            width: 100%;
            height: 100%;
            text-align: center;
            color: antiquewhite;
          "
        >
          <img src="img/${data.src}" width="300" height="400" />
          <h3>${data.title}</h3>
          <p>
          ${data.description}
          </p>
        </div>
      </div>
    </div>`;
        container.insertAdjacentHTML("beforeend", elm);
        const modal = document.querySelector("#Modal");
        const close = document.querySelector(".close");
        modal.style.display = "block";
        close.addEventListener("click", () => {
          container.textContent = "";
          modal.style.display = "none";
        });
      }
    });
  },
  handlePagination(evt) {
    const { first, prev, next, last } = this.selectDom();
    if (evt.target.classList.contains("first")) {
      limitStart = 0;
      limitEnd = 6;
      //const galleryData = await apiData.getData();
      this.galleryShowToUI(allData.slice(limitStart, limitEnd));
      this.setAttributeDisabled(first, prev);
      this.removeAttributeDisabled(next, last);
      this.handlePopup();
    } else if (evt.target.classList.contains("prev")) {
      limitStart -= 6;
      limitEnd -= 6;
      //const galleryData = await apiData.getData();
      this.galleryShowToUI(allData.slice(limitStart, limitEnd));
      this.removeAttributeDisabled(next, last);
      if (limitStart === 0) {
        this.setAttributeDisabled(first, prev);
      }
      this.handlePopup();
    } else if (evt.target.classList.contains("next")) {
      limitStart += 6;
      limitEnd += 6;
      //const galleryData = await apiData.getData();
      this.galleryShowToUI(allData.slice(limitStart, limitEnd));
      this.removeAttributeDisabled(first, prev);
      const total = this.getTotalOfData();
      if (limitEnd >= total) {
        this.setAttributeDisabled(next, last);
      }
      this.handlePopup();
    } else if (evt.target.classList.contains("last")) {
      const total = this.getTotalOfData();
      for (let i = 6; i <= total; i += 6) {
        limitStart = Math.floor(i / 6) * 6;
        limitEnd = limitStart + 6;
      }
      //const galleryData = await apiData.getData();
      this.galleryShowToUI(allData.slice(limitStart, limitEnd));
      this.removeAttributeDisabled(first, prev);
      this.setAttributeDisabled(next, last);
      this.handlePopup();
    } else if (evt.target.classList.contains("all")) {
      //const galleryData = await apiData.getData();
      this.galleryShowToUI(allData);
      this.setAttributeDisabled(next, last);
      prev.setAttribute("disabled", "disabled");
      first.removeAttribute("disabled");
      this.handlePopup();
    }
  },
  async init() {
    const { pages, first, prev } = this.selectDom();
    const galleryData = await apiData.getData();
    allData = galleryData;
    this.galleryShowToUI(allData.slice(0, 6));
    this.setAttributeDisabled(first, prev);
    pages.addEventListener("click", (evt) => this.handlePagination(evt));
    this.handlePopup();
  },
};
UI.init();
