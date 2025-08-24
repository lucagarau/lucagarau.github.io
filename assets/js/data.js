let CV = {};
let PUBLICATIONS = [];

fetch('data/cv.json')
  .then(res => res.json())
  .then(data => {
    CV = data;
    renderCV();
  });

fetch('data/publications.json')
  .then(res => res.json())
  .then(data => {
    PUBLICATIONS = data;
    renderPublications();
  });
