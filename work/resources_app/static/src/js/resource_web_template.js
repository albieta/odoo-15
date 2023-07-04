if (document.getElementById('infrastructures-container')) {
  let resources = document.querySelectorAll('.resources');
  const themeDropdown = document.getElementById('theme-dropdown');
  const universityButtons = document.querySelectorAll('.university-btn');
  const openButtons = document.querySelectorAll('.open-btn');
  let keywords = [];

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

  $(document).ready(function() {

    $.ajax({
      type: "GET",
      url: "/resources/infrastructure/keywords",
      success: function(data) {
        keywords = data.keywords;
        $('#keywords').selectivity({
          items: keywords,
          multiple: true,
        });
        document.querySelector('.keywords-list').addEventListener('selectivity-change',function(event) {
          if(event.added){
            selectedKeywords.push(event.value);
          } else {
            selectedKeywords = event.value.filter((value) => typeof value === 'string');
          }
          requestInfrastructures();
        });
      },
      error: function(xhr, textStatus, errorThrown) {
          console.log(textStatus + ': ' + errorThrown);
      }
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
        page = 1;
        requestInfrastructures();
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
        page = 1;
        requestInfrastructures();
      });
    });

    //request infrastructures initially
    requestInfrastructures();
  });
}
