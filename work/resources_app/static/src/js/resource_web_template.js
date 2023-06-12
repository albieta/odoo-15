let resources = document.querySelectorAll('.resources');
const themeDropdown = document.getElementById('theme-dropdown');
const keywordButtons = document.querySelectorAll('.keyword-btn');
const universityButtons = document.querySelectorAll('.university-btn');
const openButtons = document.querySelectorAll('.open-btn');

let selectedTheme = null;
let selectedKeywords = [];
let selectedUniversity = null;
let selectedOpen = null;

let page = 1; 

function requestInfrastructures() {
  let data = {
    'page': page,
  };
  if (selectedTheme) {
    data['theme'] = selectedTheme;
  }
  if (selectedKeywords.length > 0) {
    console.log(selectedKeywords);
    data['keywords'] = selectedKeywords.join(',');
  }
  if (selectedUniversity) {
    data['university'] = selectedUniversity;
  }
  if(selectedOpen == 'False' || selectedOpen == 'True') {
    data['open'] = selectedOpen;
  }

  $.ajax({
    type: "POST",
    url: "/resources/infrastructure/filtered",
    data: data,
    success: function(data) {

      $('#infrastructures-container').html(data);
      updateFunctions();
    },
    error: function(xhr, textStatus, errorThrown) {
        console.log(textStatus + ': ' + errorThrown);
    }
  });
}

function updateFunctions() {
  resources = document.querySelectorAll('.resources');

  resources.forEach((resource) => {
    const cardTitle = resource.querySelector('.card-title');
    const cardBody = resource.querySelector('.card-body');
    cardBody.classList.toggle('d-none');
  
    cardTitle.addEventListener('click', () => {
      cardBody.classList.toggle('d-none');
    });
  });
  
  $('.left-btn').click(function() {
    if (page > 1) {
      page = page - 1;
      requestInfrastructures();
    }
  });

  $('.right-btn').click(function() {
    if (page < document.querySelector('.products_pager').dataset.max) {
      page = page + 1;
      requestInfrastructures();
    }
  });
}


console.log("HOLA JUAN v3");

//$(document).ready(function() {
addEventListener('DOMContentLoaded', (event) => {
  console.log("DOCUMENT READY");
  console.log(jQuery.isReady);

  $('.filter-btn').click(function() {
    page = 1;
    requestInfrastructures();
  });

themeDropdown.addEventListener('change', () => {
  const selectedOption = themeDropdown.options[themeDropdown.selectedIndex];
  if (selectedOption.value === "") {
    selectedTheme = null;
  } else {
    selectedTheme = selectedOption.value;
  }
  requestInfrastructures();
});

keywordButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (button.classList.contains('selected')) {
      button.classList.remove('selected');
      selectedKeywords = selectedKeywords.filter(keyword => keyword !== button.dataset.keyword);
    } else {
      button.classList.add('selected');
      selectedKeywords.push(button.dataset.keyword);
    }
  });
});

universityButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (button.classList.contains('selected')) {
      button.classList.remove('selected');
      selectedUniversity = null;
    } else {
      universityButtons.forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');
      selectedUniversity = button.dataset.university;
    }
  });
});

openButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (button.classList.contains('selected')) {
      button.classList.remove('selected');
      selectedOpen = null;
    } else {
      openButtons.forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');
      if (button.textContent.trim() === 'Yes') {
        selectedOpen = 'True';
      } else if (button.textContent.trim() === 'No') {
        selectedOpen = 'False';
      }
    }
  });
});

//request infrastructures initially
requestInfrastructures();
});

