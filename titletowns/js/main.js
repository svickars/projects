// MISSION WORLDWIDE
var small_screen,
  medium_screen,
  large_screen,
  windowW,
  windowH,
  leader = 0;
var local_coords = [],
  searchArray = [],
  sortmode = 'descend_basic',
  sortmode2 = 'descend_seasons',
  sortmode3 = 'ascend_population',
  local,
  userSearched,
  searched,
  level,
  league,
  start,
  end;
var sideD,
  c1x,
  c1y,
  c1tip,
  c2x,
  c2y,
  c2tip,
  c3x,
  c3y,
  c3r,
  c3c,
  num = 10,
  case2num = 10,
  case3num = 10,
  h = 30,
  radius = d3
    .scaleLinear()
    .domain([0, 148])
    .range([3, 2]),
  casetwodrawn = false,
  wrapupdrawn = false,
  c3status = 'first';

var c1rectO = 1,
  c1expO = 0;

var lowerSlider = document.querySelector('#lower-left'),
  upperSlider = document.querySelector('#upper-left'),
  start = parseInt(lowerSlider.value),
  end = parseInt(upperSlider.value),
  disp1 = 0,
  disp2 = 0;

var filters = {
  'all-levels': {
    'all-leagues': [
      'mlb',
      'nba',
      'nfl',
      'nhl',
      'mls',
      'cfl',
      'baseball_m',
      'basketball_m',
      'basketball_w',
      'football_m',
      'soccer_w',
      'volleyball_w'
    ],
    'all-sports': [
      'mlb',
      'nba',
      'nfl',
      'nhl',
      'mls',
      'cfl',
      'baseball_m',
      'basketball_m',
      'basketball_w',
      'football_m',
      'soccer_w',
      'volleyball_w'
    ]
  },
  pro: {
    'all-leagues': ['mlb', 'nba', 'nfl', 'nhl', 'mls', 'cfl'],
    big4: ['mlb', 'nba', 'nfl', 'nhl'],
    mlb: ['mlb'],
    nba: ['nba'],
    nfl: ['nfl'],
    nhl: ['nhl'],
    mls: ['mls'],
    cfl: ['cfl']
  },
  college: {
    'all-sports': [
      'baseball_m',
      'basketball_m',
      'basketball_w',
      'football_m',
      'soccer_w',
      'volleyball_w'
    ],
    baseball_m: ['baseball_m'],
    basketball_m: ['basketball_m'],
    basketball_w: ['basketball_w'],
    football_m: ['football_m'],
    soccer_w: ['soccer_w'],
    volleyball_w: ['volleyball_w']
  }
};

var league_colours = d3
    .scaleOrdinal()
    .range([
      '#00FF7F',
      '#89C4F4',
      '#7462E0',
      '#F4D03F',
      '#FDE3A7',
      '#D24D57',
      '#6C7A89',
      '#6C7A89',
      '#6C7A89',
      '#6C7A89',
      '#6C7A89',
      '#6C7A89',
      '#6C7A89'
    ])
    .domain([
      'mlb',
      'nba',
      'nfl',
      'nhl',
      'mls',
      'cfl',
      'ncaa',
      'baseball_m',
      'basketball_m',
      'basketball_w',
      'football_m',
      'soccer_w',
      'volleyball_w'
    ]),
  event_colours = d3
    .scaleOrdinal()
    .range(['#F1F227', '#00AA00', '#22A7F0'])
    .domain(['title', 'finals', 'finalFour']),
  light_colour = '#b5b5b5',
  bg_colour = '#1b2129',
  dark_colour = '#191919',
  accent_colour = '#6c7a89';

var leagues = ['MLB', 'NBA', 'NFL', 'NHL', 'CFL', 'MLS', 'NCAA'],
  events = [
    {
      event: 'title',
      colour: event_colours('title')
    },
    {
      event: 'finals appearance',
      colour: event_colours('finals')
    },
    {
      event: 'final four appearance',
      colour: event_colours('finalFour')
    }
  ];

var curved_annotation = d3.annotationCustomType(d3.annotationLabel, {
    className: 'custom',
    connector: {
      type: 'curve'
    },
    note: {
      align: 'middle',
      orientation: 'leftRight'
    }
  }),
  note_annotation = d3.annotationCustomType(d3.annotationLabel, {
    className: 'custom-note',
    connector: {
      end: 'arrow'
    },
    note: {
      align: 'middle',
      orientation: 'leftRight'
    }
  }),
  padding = 5;

// DATA
// const case1 = [];
var case1data = [],
  case2data = [],
  case3data = [],
  data1,
  data2,
  data3;

// Russell

function getIP() {
  var url = 'https://api.ipify.org?format=json';
  return new Promise(function(resolve, reject) {
    $.getJSON(url, resolve).fail(reject);
  });
}

function getGeocode(_ref) {
  var ip = _ref.ip;
  var url = 'https://api.ipstack.com/' + ip + '?access_key=' + key;
  return new Promise(function(resolve, reject) {
    $.getJSON(url, resolve).fail(reject);
  });
}

/**
 * Get users approx. location according to IP address
 * @param {function} cb callback funtion
 */

function locate(cb) {
  var k = 'fd4d87f605681c0959c16d9164ab6a4a';
  var MAX_TIME = 4000;
  if (k) {
    key = k;
    var timeout = setTimeout(function() {
      return cb('timeout');
    }, MAX_TIME);

    getIP()
      .then(getGeocode)
      .then(function(response) {
        clearTimeout(timeout);
        cb(null, response);
      })
      .catch(function(err) {
        return cb(err);
      });
  } else cb('error: must pass ipstack key');
}

function resize() {
  windowW = window.innerWidth;
  windowH = window.innerHeight;

  large_screen = false;
  medium_screen = false;
  small_screen = false;

  if (windowW >= 1025) {
    large_screen = true;
  } else if (windowW >= 650) {
    medium_screen = true;
  } else if (windowW < 650) {
    small_screen = true;
  }

  if (windowH >= 900) {
    num = 20;
    case2num = 20;
    case3num = 20;
  } else if (windowH >= 500) {
    num = 15;
    case2num = 15;
    case3num = 15;
  } else {
    num = 10;
    case2num = 10;
    case3num = 10;
  }

  sideD = {
    w: $('.side > figure').width() - 5 - 0,
    // h: $(".side > figure").height() - 12 - 30,
    h: windowH / 2,
    top: 12,
    right: 5,
    bottom: 30,
    left: 10
  };

  caseone();
  casetwo();
  casethree();
} //end resize

function loadData() {
  d3.queue()
    // .defer(d3.csv, "data/metros.csv")
    .defer(d3.json, 'data/case1.json')
    .defer(d3.json, 'data/case2.json')
    .await(processData);
  // .await(caseone())
} // end loadData

function processData(error, titleData, seasonData) {
  Array.prototype.push.apply(case1data, titleData);
  Array.prototype.push.apply(case2data, seasonData);
  Array.prototype.push.apply(case3data, titleData);
  // getLocal(metros);
  caseone(true);
  casetwo(true);
  casethree(true);
} // end processData

function init() {
	locate(function (err, response) {
		local_coords.push(response.latitude, response.longitude);
		getLocal();
	});
  window.addEventListener('resize', resize);
  setup();
  loadData();
  // caseone();
} // end init

init();

function setup() {
  windowW = window.innerWidth;
  windowH = window.innerHeight;

  large_screen = false;
  medium_screen = false;
  small_screen = false;

  if (windowW >= 1025) {
    large_screen = true;
  } else if (windowW >= 650) {
    medium_screen = true;
  } else if (windowW < 650) {
    small_screen = true;
  }

  if (windowH >= 900) {
    num = 20;
    case2num = 20;
    case3num = 20;
  } else if (windowH >= 500) {
    num = 15;
    case2num = 15;
    case3num = 15;
  } else {
    num = 10;
    case2num = 10;
    case3num = 10;
  }

  sideD = {
    w: $('.side > figure').width() - 5 - 0,
    // h: $(".side > figure").height() - 12 - 30,
    h: windowH / 2,
    top: 12,
    right: 5,
    bottom: 30,
    left: 10
  };

  level = $('#filter-level :selected').data('value');
  league = $('#filter-league :selected').data('value');
  start = parseInt(lowerSlider.value);
  end = parseInt(upperSlider.value);

  // Global filter
  $('.f-header').on('click', function() {
    $('.filter-container').toggleClass('isvisible');
  });
  $('.step_blank').on('click', function() {
    $('.filter-container').toggleClass('isvisible');
  });
  $('#filter-level').change(function() {
    level = $('#filter-level :selected').data('value');
    if (level === 'pro') {
      league = $('#filter-league :selected').data('value');
      d3.select('#filter-sport').style('display', 'none');
      d3.select('#filter-league').style('display', 'inline-block');
      d3.select('#filter-league-change')
        .style('display', 'block')
        .html('League');
    } else if (level === 'college') {
      league = $('#filter-sport :selected').data('value');
      d3.select('#filter-league').style('display', 'none');
      d3.select('#filter-sport').style('display', 'inline-block');
      d3.select('#filter-league-change')
        .style('display', 'block')
        .html('Sport');
    } else {
      league = 'all-leagues';
      d3.selectAll(
        '#filter-sport, #filter-league, #filter-league-change'
      ).style('display', 'none');
    }
    caseone();
    if (casetwodrawn) casetwo();
    casethree();
    if (wrapupdrawn) wrapup();
  });
  $('#filter-league').change(function() {
    league = $('#filter-league :selected').data('value');
    caseone();
    if (casetwodrawn) casetwo();
    casethree();
    if (wrapupdrawn) wrapup();
  });
  $('#filter-sport').change(function() {
    league = $('#filter-sport :selected').data('value');
    caseone();
    if (casetwodrawn) casetwo();
    casethree();
    if (wrapupdrawn) wrapup();
  });

  $('#filter_mobile_all').on('mouseover', function() {
    $('.filter_mobile').removeClass('active');
    $('#filter_mobile_all').addClass('active');
    level = 'all-levels';
    league = 'all-leagues';
    caseone();
    if (casetwodrawn) casetwo();
    casethree();
    if (wrapupdrawn) wrapup();
  });
  $('#filter_mobile_pro').on('mouseover', function() {
    $('.filter_mobile').removeClass('active');
    $('#filter_mobile_pro').addClass('active');
    level = 'pro';
    league = 'all-leagues';
    caseone();
    if (casetwodrawn) casetwo();
    casethree();
    if (wrapupdrawn) wrapup();
  });
  $('#filter_mobile_big4').on('mouseover', function() {
    $('.filter_mobile').removeClass('active');
    $('#filter_mobile_big4').addClass('active');
    level = 'pro';
    league = 'big4';
    caseone();
    if (casetwodrawn) casetwo();
    casethree();
    if (wrapupdrawn) wrapup();
  });
  $('#filter_mobile_college').on('mouseover', function() {
    $('.filter_mobile').removeClass('active');
    $('#filter_mobile_college').addClass('active');
    level = 'college';
    league = 'all-sports';
    caseone();
    if (casetwodrawn) casetwo();
    casethree();
    if (wrapupdrawn) wrapup();
  });

  $('#filter_mobile_start').on('change', function() {
    start = $('#filter_mobile_start').val();
    caseone();
    if (casetwodrawn) casetwo();
    casethree();
    if (wrapupdrawn) wrapup();
  });
  $('#filter_mobile_end').on('change', function() {
    start = $('#filter_mobile_end').val();
    caseone();
    if (casetwodrawn) casetwo();
    casethree();
    if (wrapupdrawn) wrapup();
  });

  var w = 213,
    h = $('.filter-year').height();

  $('.yearinput-left').width(w);

  var yearrange = d3
    .select('.yearrange-left')
    .attr('width', w)
    .attr('height', h);
  var yearrangeX = d3
    .scaleLinear()
    .domain([1870, 2018])
    .range([3, w]);
  var yearrangefill = yearrange
    .append('line')
    .attr('class', 'yearFilterHide')
    .attr('x1', yearrangeX(start))
    .attr('x2', yearrangeX(end))
    .attr('y1', -5)
    .attr('y2', -5);
  var yearrangestart = d3
    .select('.filter-year')
    .append('div')
    .attr('class', 'yearFilterHide yearFilter_label')
    .style('left', yearrangeX(start) + 'px')
    .style('margin-right', 0)
    .html(start);
  var yearrangeend = d3
    .select('.filter-year')
    .append('div')
    .attr('class', 'yearFilterHide yearFilter_label')
    .style('left', yearrangeX(end) - 26 + 'px')
    .style('margin-right', 0)
    .html(end);

  upperSlider.onchange = function() {
    caseone();
    if (casetwodrawn) casetwo();
    casethree();
    if (wrapupdrawn) wrapup();
  };
  upperSlider.oninput = function() {
    start = parseInt(lowerSlider.value);
    end = parseInt(upperSlider.value);
    var l, r;

    l = yearrangeX(start) - 13;
    if (start < 1883) l = yearrangeX(start) - (start - 1870);
    if (start >= 1984 && end - start < 36) l = yearrangeX(end) - 26 - 30;

    r = yearrangeX(end) - 13;
    if (end > 2006) r = yearrangeX(end) - 26 + (2018 - end);
    if (start <= 1883 && end - start < 30) r = yearrangeX(start) + 30;
    if (start >= 1877 && start < 1984 && end - start < 20)
      r = yearrangeX(start) + 17;

    if (end < start + 1) {
      lowerSlider.value = end - 1;
      if (start == lowerSlider.min) {
        upperSlider.value = 1871;
      }
    }

    yearrangefill.attr('x1', yearrangeX(start)).attr('x2', yearrangeX(end));
    yearrangestart.style('left', l + 'px').html(start);
    yearrangeend.style('left', r + 'px').html(end);
  };
  lowerSlider.onchange = function() {
    caseone();
    if (casetwodrawn) casetwo();
    casethree();
    if (wrapupdrawn) wrapup();
  };
  lowerSlider.oninput = function() {
    start = parseInt(lowerSlider.value);
    end = parseInt(upperSlider.value);
    var l, r;

    l = yearrangeX(start) - 13;
    if (start < 1883) l = yearrangeX(start) - (start - 1870);
    if (start >= 1984 && end - start < 36) l = yearrangeX(end) - 26 - 30;

    r = yearrangeX(end) - 13;
    if (end > 2006) r = yearrangeX(end) - 26 + (2018 - end);
    if (start <= 1883 && end - start < 30) r = yearrangeX(start) + 30;
    if (start >= 1877 && start < 1984 && end - start < 20)
      r = yearrangeX(start) + 17;

    if (start > end - 1) {
      upperSlider.value = start + 1;
      if (end == upperSlider.max) {
        lowerSlider.value = parseInt(upperSlider.max) - 1;
      }
    }

    yearrangefill.attr('x1', yearrangeX(start)).attr('x2', yearrangeX(end));
    yearrangestart.style('left', l + 'px').html(start);
    yearrangeend.style('left', r + 'px').html(end);
  };

  // Scrolly
  var container = d3.selectAll('body');
  var stepSel = container.selectAll('.step');

  enterView({
    selector: stepSel.nodes(),
    offset: 0.5,
    enter: function(el) {
      var index = +d3.select(el).attr('data-index');
      $('.step').removeClass('active');
      $(el).addClass('active');
      if (index < 5) caseone_update(index, index - 1);
      if (index > 4 && index < 11) casetwo_update(index, index - 1);
      if (index > 10) casethree_update(index, index - 1);
    },
    exit: function(el) {
      var index = +d3.select(el).attr('data-index');
      $('.step').removeClass('active');
      $(el).addClass('active');
      if (index < 5) caseone_update(index, index + 1);
      if (index > 4 && index < 11) casetwo_update(index, index + 1);
      if (index > 10) casethree_update(index, index + 1);
    }
  });

  // Search
  var options = {
    data: searchArray,
    list: {
      maxNumberOfElements: 5,
      sort: {
        enabled: true
      },
      match: {
        enabled: true
      },
      onClickEvent: function() {
        searched = $('#citysearch-left').val();
        caseone();
        if (casetwodrawn) casetwo();
        casethree();
        if (wrapupdrawn) wrapup();
      },
      onKeyEnterEvent: function() {
        searched = $('#citysearch-left').val();
        caseone();
        if (casetwodrawn) casetwo();
        casethree();
        if (wrapupdrawn) wrapup();
      }
    }
  };
  $('#citysearch-left').easyAutocomplete(options);

  // Tooltips
  var offset = [25, 0];
  if (small_screen) offset = [25, -150];
  c1tip = d3
    .tip()
    .attr('class', 'd3-tip')
    .html(function(d) {
      return (
        "<div class='tipH'><h1>" +
        d.year +
        "</h1></div><div class='tipH' style='background-color: " +
        league_colours(d.sport) +
        "'><h3>" +
        replaceSports(d.sport) +
        '</h3></div><h2>' +
        d.team +
        '</h2>'
      );
    })
    .direction('e')
    .offset(offset);
  c2tip = d3
    .tip()
    .attr('class', 'd3-tip dark-tip')
    .html(function(d) {
      var list = d.newteams;
      var titlesDisp = '',
        finalsDisp = '',
        finalFoursDisp = '';

      var titles = [],
        finals = [],
        finalFours = [];

      for (var j = 0; j < d.newteams.length; j++) {
        if (d.newteams[j].result === 'title')
          titles.push(
            d.newteams[j].team +
              ' (' +
              replaceSports(d.newteams[j].sport) +
              ')&nbsp;'
          );
        if (d.newteams[j].result === 'finals')
          finals.push(
            d.newteams[j].team +
              ' (' +
              replaceSports(d.newteams[j].sport) +
              ')&nbsp;'
          );
        if (d.newteams[j].result === 'finalFour')
          finalFours.push(
            d.newteams[j].team +
              ' (' +
              replaceSports(d.newteams[j].sport) +
              ')&nbsp;'
          );
      }

      if (titles.length > 0)
        titlesDisp =
          "<h2 style='color:" +
          event_colours('title') +
          "'>Titles</h2><p>" +
          titles +
          '</p>';
      if (finals.length > 0)
        finalsDisp =
          "<h2 style='color:" +
          event_colours('finals') +
          "'>Finals Appearances</h2><p>" +
          finals +
          '</p>';
      if (finalFours.length > 0)
        finalFoursDisp =
          "<h2 style='color:" +
          event_colours('finalFour') +
          "'>Final Four Appearances</h2><p>" +
          finalFours +
          '</p>';
      return (
        '<h1>' + d.season + '</h1>' + titlesDisp + finalsDisp + finalFoursDisp
      );
    })
    .direction('s')
    .offset(offset);

  // Case One Switches
  $('#switch_actual').on('click', function() {
    $('#switch_actual').addClass('isactive');
    $('#switch_expected').removeClass('isactive');
    c1rectO = 1;
    c1expO = 0;
    d3.selectAll('.legend_case1_phase1')
      .transition()
      .style('opacity', c1rectO);
    d3.selectAll('.legend_case1_phase2')
      .transition()
      .style('opacity', c1expO);
    caseone();
  });
  $('#switch_expected').on('click', function() {
    $('#switch_actual').removeClass('isactive');
    $('#switch_expected').addClass('isactive');
    c1rectO = 0;
    c1expO = 1;
    d3.selectAll('.legend_case1_phase1')
      .transition()
      .style('opacity', c1rectO);
    d3.selectAll('.legend_case1_phase2')
      .transition()
      .style('opacity', c1expO);
    caseone();
  });
  $('#switch_high_diff').on('click', function() {
    $('#switch_high_diff').addClass('isactive');
    $('#switch_low_diff').removeClass('isactive');
    sortmode = 'descend_diff';
    caseone();
  });
  $('#switch_low_diff').on('click', function() {
    $('#switch_high_diff').removeClass('isactive');
    $('#switch_low_diff').addClass('isactive');
    sortmode = 'descend_basic';
    caseone();
  });
  $('#showMoreC1').on('click', function() {
    num += 10;
    $('#case2_scrolly').css('margin-top', (num - 1) * 30 - 600 + 'px');
    // $("#case1_hr").css("margin-top", ((num - 1) * 30) - 500 + "px")
    caseone();
  });

  // Case Two Switches
  $('#switch_dynasty').on('click', function() {
    $('#switch_dynasty').addClass('isactive');
    $('#switch_finalfour').removeClass('isactive');
    $('#switch_dryspell-long').removeClass('isactive');
    $('#switch_dryspell-short').removeClass('isactive');
    sortmode2 = 'descend_max_dynasty';
    casetwo();
  });
  $('#switch_finalfour').on('click', function() {
    $('#switch_dynasty').removeClass('isactive');
    $('#switch_finalfour').addClass('isactive');
    $('#switch_dryspell-long').removeClass('isactive');
    $('#switch_dryspell-short').removeClass('isactive');
    sortmode2 = 'descend_max_prettygooddynasty';
    casetwo();
  });
  $('#switch_dryspell-long').on('click', function() {
    $('#switch_dynasty').removeClass('isactive');
    $('#switch_finalfour').removeClass('isactive');
    $('#switch_dryspell-long').addClass('isactive');
    $('#switch_dryspell-short').removeClass('isactive');
    sortmode2 = 'descend_max_dryspell';
    casetwo();
  });
  $('#switch_dryspell-short').on('click', function() {
    $('#switch_dynasty').removeClass('isactive');
    $('#switch_finalfour').removeClass('isactive');
    $('#switch_dryspell-long').removeClass('isactive');
    $('#switch_dryspell-short').addClass('isactive');
    sortmode2 = 'ascend_max_dryspell';
    casetwo();
  });
  $('#showMoreC2').on('click', function() {
    case2num += 10;
    $('#case3_scrolly').css('margin-top', (case2num - 1) * 30 - 600 + 'px');
    casetwo();
  });

  // Case Three Switches
  $('#casethree_los-angeles').on('click', function() {
    $('#casethree_los-angeles').addClass('isactive');
    $('#casethree_newyork').removeClass('isactive');
    $('#casethree_boston').removeClass('isactive');
    $('#casethree_bay-area').removeClass('isactive');
    userSearched = searched;
    searched = 'Greater Los Angeles, CA';
    casethree();
  });
  $('#casethree_newyork').on('click', function() {
    $('#casethree_los-angeles').removeClass('isactive');
    $('#casethree_newyork').addClass('isactive');
    $('#casethree_boston').removeClass('isactive');
    $('#casethree_bay-area').removeClass('isactive');
    userSearched = searched;
    searched = 'New York Metro Area';
    casethree();
  });
  $('#casethree_boston').on('click', function() {
    $('#casethree_los-angeles').removeClass('isactive');
    $('#casethree_newyork').removeClass('isactive');
    $('#casethree_boston').addClass('isactive');
    $('#casethree_bay-area').removeClass('isactive');
    userSearched = searched;
    searched = 'Greater Boston, MA';
    casethree();
  });
  $('#casethree_bay-area').on('click', function() {
    $('#casethree_los-angeles').removeClass('isactive');
    $('#casethree_newyork').removeClass('isactive');
    $('#casethree_boston').removeClass('isactive');
    $('#casethree_bay-area').addClass('isactive');
    userSearched = searched;
    searched = 'San Francisco Bay Area, CA';
    casethree();
  });

  $('#switch_c3_under').on('click', function() {
    $('#switch_c3_under').addClass('isactive');
    $('#switch_c3_over').removeClass('isactive');
    $('#switch_c3_scatter').removeClass('isactive');
    sortmode3 = 'ascend_tlq';
    if (c3status === 'scatter_tlq') c3status = 'ordering';
    casethree();
    c3status = 'ordered_under';
  });
  $('#switch_c3_over').on('click', function() {
    $('#switch_c3_under').removeClass('isactive');
    $('#switch_c3_over').addClass('isactive');
    $('#switch_c3_scatter').removeClass('isactive');
    sortmode3 = 'descend_tlq';
    if (c3status === 'scatter_tlq') c3status = 'ordering';
    casethree();
    c3status = 'ordered_over';
  });
  $('#switch_c3_scatter').on('click', function() {
    $('#switch_c3_under').removeClass('isactive');
    $('#switch_c3_over').removeClass('isactive');
    $('#switch_c3_scatter').addClass('isactive');
    sortmode3 = 'descend_population';
    c3status = 'scatter_tlq';
    casethree();
  });
  $('#showMoreC3').on('click', function() {
    case3num += 10;
    $('#wrapup_container').css('margin-top', (case3num - 1) * 30 - 600 + 'px');
    // var newheight = $("#case3_scrolly").height();
    // newheight += (case3num - 1) * 30
    // $("#case3_scrolly").css("height", newheight + "px")
    // $("#case3_scrolly").css("margin-bottom", ((case3num - 1) * 30) - 500 + "px")
    casethree();
  });
}

function caseone(first) {
  if (first) {
    start = 1870;
    end = 2018;
    level = 'all-levels';
    league = 'all-leagues';
  }
  var filter = filters[level][league],
    total_titles = 0,
    total_seasons = 0,
    rank,
    adjRank,
    searchedRank,
    searchedAdjRank;
  leader = 0;

  d3.select('#selected_filters')
    .text(level + ' / ' + league + ' / ' + start + '-' + end)
    .style('opacity', 1);

  var data = case1data;
  data.forEach(function(d) {
    var local_seasons = 0;
    d.values = d.values.sort(function(a, b) {
      return d3.ascending(+a.year, +b.year);
    });
    d.newvalues = d.values.filter(function(d) {
      return (
        d.year >= start && d.year <= end && $.inArray(d.sport, filter) > -1
      );
    });
    d.newvalues = d.newvalues.sort(function(a, b) {
      return d3.ascending(+a.year, +b.year) || d3.ascending(a.team, b.team);
    });
    d.newvalues.forEach(function(d, i) {
      d.n = i;
    });
    for (var i = 0; i < filter.length; i++) {
      local_seasons += d.seasons[filter[i]];
    }
    d.local_seasons = local_seasons;
    total_titles += d.newvalues.length;
    total_seasons += local_seasons;
  });
  data = data.filter(function(d) {
    return d.local_seasons > 0 || d.key === local || d.key === searched;
  });
  data.forEach(function(d) {
    d.expected = (total_titles / total_seasons) * d.local_seasons;
    d.differential = d.newvalues.length - d.expected;
  });
  data = data.sort(function(a, b) {
    if (sortmode === 'descend_basic')
      return (
        d3.descending(+a.newvalues.length, +b.newvalues.length) ||
        d3.ascending(a.key, b.key)
      );
    if (sortmode === 'descend_diff')
      return (
        d3.descending(+a.differential, +b.differential) ||
        d3.descending(+a.newvalues.length, +b.newvalues.length) ||
        d3.ascending(a.key, b.key)
      );
    if (sortmode === 'ascend_diff')
      return (
        d3.ascending(+a.differential, +b.differential) ||
        d3.descending(+a.newvalues.length, +b.newvalues.length) ||
        d3.ascending(a.key, b.key)
      );
  });
  data.forEach(function(d, i) {
    d.i = i + 1;
    if (d.key === local) rank = i;
    if (d.key === searched) searchedRank = i;
  });
  data1 = data;

  adjRank = rank;
  searchedAdjRank = 0;
  if (rank > num - 2) adjRank = num - 1;
  if (searchedRank < num) searchedAdjRank = searchedRank;
  if (searched === local && rank > num - 2) searchedAdjRank = adjRank;
  if (searchedRank > num - 1 && searchedAdjRank === 0) leader = 1;
  if (adjRank > num - 2) {
    var mainData = data.slice(0, num - 1);
  } else {
    var mainData = data.slice(0, num);
  }
  if (local != undefined && searched != local && searchedAdjRank === num - 1)
    searchedAdjRank = 0;
  if (searchedRank > num - 2 && searched != local) {
    mainData = mainData.slice(0, mainData.length - 1);
  }
  if (searched != undefined && searchedRank > num - 2 && searched != local) {
    var searchData = data.filter(function(d) {
      return d.key === searched;
    });
    mainData = mainData.filter(function(d) {
      return d.key != searched;
    });
    Array.prototype.push.apply(searchData, mainData);
    mainData = searchData;
  }
  if (mainData.length > 0) var leadingcity = mainData[leader].key;
  if (local != undefined) {
    var localData = data.filter(function(d) {
      return d.key === local;
    });
    if (rank > num - 2) Array.prototype.push.apply(mainData, localData);
  }
  data = mainData;
  data.forEach(function(d, i) {
    d.newvalues.forEach(function(d) {
      d.i = i;
    });
  });

  var filtertext = filterConvert(league, level);
  $('#step0_filter').html(filtertext);
  $('#step0_start').html(start);
  $('#step0_end').html(end);
  if (local != undefined) {
    if (leadingcity === local) {
      $('#step1_local').html('');
      $('#step2_local').html('');
      $('#step2_howmany_local').html('');
    } else {
      $('#step1_local').html(
        "(<span class='offsetcolour'>" +
          local +
          '</span> teams have played ' +
          localData[0].local_seasons +
          ')'
      );
      $('#step2_local').html(', while ' + local + ' has a ');
      $('#step2_howmany_local').html(
        ((data[adjRank].newvalues.length - data[adjRank].expected).toFixed(1) <
        0
          ? ''
          : '+') +
          (data[adjRank].newvalues.length - data[adjRank].expected).toFixed(1) +
          ' differential'
      );
    }
    $('#step0_rank').html(rank);
  }

  if (leadingcity != undefined) {
    $('#step0_leader').html(leadingcity);
    $('.step1_leader').html(leadingcity.substring(0, leadingcity.length - 4));
    $('#step2_leader').html(leadingcity.substring(0, leadingcity.length - 4));
  } else {
    $('#step0_leader').html('Greater Los Angeles, CA');
    $('.step1_leader').html('Greater Los Angeles');
    $('#step2_leader').html('Greater Los Angeles');
  }
  if (leadingcity === 'New York Metro Area')
    $('.step1_leader').html('New York Metro Area');
  if (leadingcity === 'New York Metro Area')
    $('#step2_leader').html('New York Metro Area');
  if (data.length > 0) {
    $('#step1_totalseasons').html(data[leader].local_seasons);
    $('#step1_totaltitles').html(data[leader].newvalues.length);
    if (data[leader].expected < data[leader].newvalues.length) {
      if (data[leader].newvalues.length - data[leader].expected > 10)
        $('#step2_lessormore').html('a lot fewer');
      $('#step2_lessormore').html('fewer');
    } else {
      if (data[leader].expected - data[leader].newvalues.length > 10)
        $('#step2_lessormore').html('a lot more');
      $('#step2_lessormore').html('more');
    }
    $('#step2_howmany').html(data[leader].expected.toFixed(1));
    $('#step3_includes').html(
      data[leader + 8].key +
        ', ' +
        data[leader + 7].key +
        ', and ' +
        data[leader + 6].key
    );
  }

  c1x = d3
    .scaleLinear()
    .domain([0, 80])
    .range([150, sideD.w]);
  c1y = d3
    .scaleBand()
    .domain(d3.range(num))
    .range([0, num * h]);

  var xAxis = d3
    .axisTop(c1x)
    .tickSize(num * h)
    .tickFormat(function(d) {
      if (d === 0) return d + ' titles';
      return d;
    });

  if (first) {
    var svg = d3
        .select('.case1')
        .append('svg')
        .attr('width', sideD.w + sideD.left + sideD.right)
        .attr('height', num * h),
      legend = d3
        .select('#case1_header')
        .append('svg')
        .attr('width', sideD.w + sideD.left + sideD.right)
        .attr('height', h),
      g = svg
        .append('g')
        .attr('class', 'group')
        .attr('transform', 'translate(' + sideD.left + ',' + sideD.top + ')'),
      legendg = legend
        .append('g')
        .attr('transform', 'translate(' + sideD.left + ',' + sideD.top + ')');
    svg
      .append('g')
      .attr('class', 'x axis c1axis')
      .attr('transform', 'translate(' + sideD.left + ',' + num * h + ')')
      .call(xAxis);
    legendg
      .selectAll('.legend_case1_phase1.rect')
      .data(leagues)
      .enter()
      .append('rect')
      .attr('class', 'legend_case1_phase1 rect legend')
      .attr('x', function(d, i) {
        return i * 50;
      })
      .attr('y', -10)
      .attr('width', 3)
      .attr('height', 20)
      .style('opacity', c1rectO)
      .style('fill', function(d) {
        // return league_colours(d.toLowerCase());
        return 'none';
      });
    legendg
      .selectAll('.legend_case1_phase1.text')
      .data(leagues)
      .enter()
      .append('text')
      .attr('class', 'legend_case1_phase1 text legend')
      .attr('x', function(d, i) {
        return i * 30;
      })
      .attr('y', 0)
      .attr('dx', -7)
      .attr('dy', 4)
      .style('opacity', c1rectO)
      .style('fill', function(d) {
        return league_colours(d.toLowerCase());
      })
      .text(function(d) {
        return replaceSports(d);
      });
    legendg
      .append('line')
      .attr('class', 'legend_case1_phase2 legend')
      .attr('x1', 5)
      .attr('y1', 0)
      .attr('x2', c1x(0))
      .attr('y2', 0)
      .style('stroke', 'white')
      .style('opacity', c1expO)
      .style('stroke-width', 1);
    legendg
      .append('text')
      .attr('class', 'legend_case1_phase2 legend')
      .attr('x', 5)
      .attr('y', 10)
      .attr('dy', 5)
      .attr('dx', -8)
      .style('text-anchor', 'start')
      .style('font-family', 'Inconsolata')
      .style('font-size', 12)
      .style('opacity', c1expO)
      .text('Expected Titles');
    legendg
      .append('text')
      .attr('class', 'legend_case1_phase2 legend')
      .attr('x', c1x(0))
      .attr('y', 10)
      .attr('dy', 5)
      .attr('dx', -8)
      .style('text-anchor', 'start')
      .style('font-family', 'Inconsolata')
      .style('font-size', 12)
      .style('opacity', c1expO)
      .text('Actual Titles');
    legendg
      .append('circle')
      .attr('class', 'legend_case1_phase2 legend')
      .attr('cx', 5)
      .attr('y', 0)
      .attr('r', 2)
      .style('fill', 'white')
      .style('opacity', c1expO);
    legendg
      .append('circle')
      .attr('class', 'legend_case1_phase2 legend')
      .attr('cx', c1x(0))
      .attr('y', 0)
      .attr('r', 4)
      .style('fill', bg_colour)
      .style('stroke', 'white')
      .style('opacity', c1expO);

    g.append('rect')
      .attr('id', 'c1searchback')
      .attr('x', -50)
      .attr('y', c1y(0) - 5)
      .attr('width', sideD.w + 45)
      .attr('height', h)
      .style('fill', dark_colour)
      .style('opacity', 0);

    if (local != undefined) {
      g.append('text')
        .attr('id', 'c1location')
        .attr('class', 'icon')
        .attr(
          'x',
          c1x(0) -
            getTextWidth(data[adjRank].key, 'bold 13px aktiv-grotesk') -
            15
        )
        .attr('y', c1y(adjRank))
        .attr('dy', 14)
        .style('text-anchor', 'end')
        .style('fill', accent_colour)
        .text('\uf124');
      g.select('.c1label-' + camelize(local)).style('font-weight', 'bold');
      g.append('line')
        .attr('id', 'c1locationLine')
        .attr(
          'x1',
          c1x(0) - getTextWidth(data[adjRank].key, 'bold 16px aktiv-grotesk')
        )
        .attr('x2', sideD.w)
        .attr('y1', c1y(adjRank) - 5)
        .attr('y2', c1y(adjRank) - 5)
        .style('opacity', 0);
    }
    g.append('text')
      .attr('id', 'c1searched')
      .attr('class', 'icon')
      .attr('x', -100)
      .attr('y', -100)
      .attr('dy', 14)
      .style('opacity', 0)
      .style('fill', accent_colour)
      .text('\uf002');
    if (adjRank > num - 2) {
      g.select('#c1locationLine')
        .transition()
        .style('opacity', 1);
    }
  } else {
    var svg = d3
        .select('.case1 svg')
        .transition()
        .attr('width', sideD.w + sideD.left + sideD.right)
        .attr('height', num * h),
      g = d3.select('.group');
    d3.select('.c1axis')
      .transition()
      .attr('transform', 'translate(' + sideD.left + ',' + num * h + ')')
      .call(xAxis);

    if (searched != undefined) {
      g.select('#c1searchback')
        .transition()
        .attr('x', function() {
          if (searched === local)
            return (
              c1x(0) -
              getTextWidth(
                data[searchedAdjRank].key,
                'bold 13px aktiv-grotesk'
              ) -
              45
            );
          return (
            c1x(0) -
            getTextWidth(data[searchedAdjRank].key, 'bold 13px aktiv-grotesk') -
            30
          );
        })
        .attr('y', c1y(searchedAdjRank) - 5)
        .attr('width', function() {
          if (searched === local)
            return (
              sideD.w -
              (c1x(0) -
                getTextWidth(
                  data[searchedAdjRank].key,
                  'bold 13px aktiv-grotesk'
                ) -
                45)
            );
          return (
            sideD.w -
            (c1x(0) -
              getTextWidth(
                data[searchedAdjRank].key,
                'bold 13px aktiv-grotesk'
              ) -
              30)
          );
        })
        .attr('height', h)
        .style('opacity', 1);

      g.select('#c1searched')
        .attr('x', function() {
          if (searched === local)
            return (
              c1x(0) -
              getTextWidth(
                data[searchedAdjRank].key,
                'bold 13px aktiv-grotesk'
              ) -
              40
            );
          return (
            c1x(0) -
            getTextWidth(data[searchedAdjRank].key, 'bold 13px aktiv-grotesk') -
            25
          );
        })
        .attr('y', c1y(searchedAdjRank))
        .transition()
        .style('opacity', 1);
      g.selectAll('.label').style('font-weight', 'normal');
      g.select('.c1label-' + camelize(searched)).style('font-weight', 'bold');
    }
    if (local != undefined) {
      g.select('#c1location')
        .transition()
        .duration(500)
        .attr('y', c1y(adjRank));
      g.select('.c1label-' + camelize(local)).style('font-weight', 'bold');
      if (adjRank > num - 2) {
        g.select('#c1locationLine')
          .transition()
          .attr(
            'x1',
            c1x(0) - getTextWidth(data[adjRank].key, 'bold 16px aktiv-grotesk')
          )
          .attr('x2', sideD.w)
          .attr('y1', c1y(adjRank) - 5)
          .attr('y2', c1y(adjRank) - 5)
          .style('opacity', 1);
      } else {
        g.select('#c1locationLine')
          .transition()
          .style('opacity', 0);
      }
    }
  }
  if (first) g.call(c1tip);

  var text = g.selectAll('.label').data(data, function(d) {
    return d.key;
  });
  text
    .enter()
    .append('text')
    .attr('class', function(d, i) {
      return 'label c1label-' + i + ' c1label-' + camelize(d.key);
    })
    .attr('x', 0)
    .attr('y', function(d, i) {
      return c1y(i);
    })
    .attr('dy', 12)
    .style('text-anchor', 'end')
    .style('opacity', 0)
    .text(function(d, i) {
      return d.key;
    })
    .merge(text)
    .transition()
    .duration(500)
    .attr('class', function(d, i) {
      return 'label c1label-' + i + ' c1label-' + camelize(d.key);
    })
    .attr('x', c1x(0) - 10)
    .attr('y', function(d, i) {
      return c1y(i);
    })
    .style('opacity', function(d, i) {
      if (i === leader && c1expO > 0) return c1expO * 10;
      if (i != leader && c1expO > 0) return c1expO;
      1;
    })
    .style('fill', function(d) {
      if (d.key === local || d.key === searched) return accent_colour;
      // return "#191919";
    });
  text
    .exit()
    .transition()
    .duration(500)
    .attr('y', sideD.h)
    .style('opacity', 0)
    .remove();

  var text_count = g.selectAll('.count').data(data, function(d) {
    return d.key;
  });
  text_count
    .enter()
    .append('text')
    .attr('class', function(d, i) {
      return 'count c1label_count-' + i;
    })
    .attr('x', function(d) {
      return c1x(0);
    })
    .attr('y', function(d, i) {
      return c1y(i);
    })
    .style('opacity', 0)
    .merge(text_count)
    .attr('class', function(d, i) {
      return 'count c1label_count-' + i;
    })
    .transition()
    .duration(500)
    .attr('dy', 12)
    .attr('dx', 6)
    .attr('y', function(d, i) {
      return c1y(i);
    })
    .attr('x', function(d) {
      if (c1expO > 0 && d.expected > d.newvalues.length) return c1x(d.expected);
      return c1x(d.newvalues.length);
    })
    .style('opacity', function(d, i) {
      if (i === leader && c1expO > 0) return c1expO * 10;
      if (i != leader && c1expO > 0) return c1expO;
      1;
    })
    .style('fill', function(d) {
      if (d.key === local || d.key === searched) return accent_colour;
      return 'white';
    })
    .style('text-anchor', 'start')
    .text(function(d) {
      if (c1expO > 0)
        return (
          ((d.newvalues.length - d.expected).toFixed(1) < 0 ? '' : '+') +
          (d.newvalues.length - d.expected).toFixed(1)
        );
      return d.newvalues.length;
    });
  text_count
    .exit()
    .transition()
    .duration(500)
    .style('opacity', 0)
    .remove();

  var connect = g.selectAll('.c1connect').data(data, function(d) {
    return d.key;
  });
  connect
    .enter()
    .append('line')
    .attr('class', function(d, i) {
      return 'c1connect c1connect-' + i;
    })
    .attr('x1', function(d) {
      return c1x(d.newvalues.length);
    })
    .attr('y1', function(d, i) {
      return c1y(i) + h / 2 - 7;
    })
    .attr('x2', function(d) {
      return c1x(d.newvalues.length);
    })
    .attr('y2', function(d, i) {
      return c1y(i) + h / 2 - 7;
    })
    .style('stroke', function(d) {
      if (d.key === local || d.key === searched) return accent_colour;
      return 'white';
    })
    .style('stroke-width', 1)
    .style('opacity', 0)
    .merge(connect)
    .transition()
    .duration(500)
    .attr('class', function(d, i) {
      return 'c1connect c1connect-' + i;
    })
    .attr('x1', function(d) {
      return c1x(d.newvalues.length);
    })
    .attr('y1', function(d, i) {
      return c1y(i) + h / 2 - 7;
    })
    .attr('x2', function(d) {
      return c1x(d.expected);
    })
    .attr('y2', function(d, i) {
      return c1y(i) + h / 2 - 7;
    })
    .style('opacity', function(d, i) {
      if (i === leader) return c1expO * 10;
      return c1expO;
    });
  connect
    .exit()
    .transition()
    .duration(500)
    .attr('x2', function(d) {
      return c1x(d.newvalues.length);
    })
    .style('opacity', 0)
    .remove();

  var actual = g.selectAll('.c1act').data(data, function(d) {
    return d.key;
  });
  actual
    .enter()
    .append('circle')
    .attr('class', function(d, i) {
      return 'c1act c1act-' + i;
    })
    .attr('cx', c1x(0))
    .attr('cy', function(d, i) {
      return c1y(i);
    })
    .attr('r', 4)
    .style('fill', bg_colour)
    .style('stroke', function(d) {
      if (d.key === local || d.key === searched) return accent_colour;
      return 'white';
    })
    .style('opacity', 0)
    .merge(actual)
    .transition()
    .duration(500)
    .attr('class', function(d, i) {
      return 'c1act c1act-' + i;
    })
    .attr('cx', function(d) {
      return c1x(d.newvalues.length);
    })
    .attr('cy', function(d, i) {
      return c1y(i) + h / 2 - 7;
    })
    .style('opacity', function(d, i) {
      if (i === leader) return c1expO * 10;
      return c1expO;
    });
  actual
    .exit()
    .transition()
    .duration(500)
    .attr('cy', sideD.h)
    .style('opacity', 0)
    .remove();

  var expected = g.selectAll('.c1exp').data(data, function(d) {
    return d.key;
  });
  expected
    .enter()
    .append('circle')
    .attr('class', function(d, i) {
      return 'c1exp c1exp-' + i;
    })
    .attr('cx', c1x(0))
    .attr('cy', function(d, i) {
      return c1y(i);
    })
    .attr('r', 2)
    .style('fill', function(d) {
      if (d.key === local || d.key === searched) return accent_colour;
      return 'white';
    })
    .style('opacity', 0)
    .merge(expected)
    .transition()
    .duration(500)
    .attr('class', function(d, i) {
      return 'c1exp c1exp-' + i;
    })
    .attr('cx', function(d) {
      return c1x(d.expected);
    })
    .attr('cy', function(d, i) {
      return c1y(i) + h / 2 - 7;
    })
    .style('opacity', function(d, i) {
      if (i === leader) return c1expO * 10;
      return c1expO;
    });
  expected
    .exit()
    .transition()
    .duration(500)
    .attr('cy', sideD.h)
    .style('opacity', 0)
    .remove();

  var back = g.selectAll('.back').data(data);
  back
    .enter()
    .append('rect')
    .merge(back)
    .attr('class', function(d, i) {
      return 'back back-' + i;
    })
    .attr('x', 0)
    .attr('y', function(d, i) {
      return c1y(i);
    })
    .attr('width', sideD.w)
    .attr('height', h)
    .style('fill', 'rgba(0,0,0,0)')
    .on('mouseover', function(d, i) {
      g.selectAll('.c1label-' + i + ', .c1label_count-' + i).style(
        'font-weight',
        'bold'
      );
    })
    .on('mouseout', function(d, i) {
      if (d.key != local && d.key != searched)
        g.selectAll('.c1label-' + i + ', .c1label_count-' + i).style(
          'font-weight',
          'normal'
        );
    });
  back.exit().remove();

  var group = g.selectAll('.c1rect').data(data);
  group
    .enter()
    .append('g')
    .attr('class', 'c1rect')
    .merge(group)
    .attr('id', function(d) {
      return '';
    });
  group.exit().remove();

  var rect = g
    .selectAll('.c1rect')
    .selectAll('.c1rects')
    .data(function(d) {
      return d.newvalues;
    });
  rect
    .enter()
    .append('rect')
    .attr('class', 'c1rects')
    .attr('x', c1x(0))
    .attr('y', function(d, i) {
      return c1y(d.i);
    })
    .attr('width', 0)
    .attr('height', 15)
    .style('opacity', 0)
    .style('fill', function(d) {
      return league_colours(d.sport);
    })
    .merge(rect)
    .transition()
    .duration(500)
    .delay(function(d, i) {
      return i;
    })
    .attr('class', function(d) {
      return 'c1rects c1rect-' + d.i;
    })
    .attr('x', function(d) {
      return c1x(d.n + 1) - 1;
    })
    .attr('y', function(d, i) {
      return c1y(d.i);
    })
    .attr('width', 2)
    .style('fill', function(d) {
      return league_colours(d.sport);
    })
    .style('opacity', c1rectO);
  g.selectAll('.c1rects').style('fill', function(d) {
    return league_colours(d.sport);
  });
  rect
    .exit()
    .transition()
    .duration(250)
    .delay(function(d, i) {
      return 148 - i * 3;
    })
    .attr('y', sideD.h)
    .style('opacity', 0)
    .remove();

  var back_rect = g
    .selectAll('.c1rect')
    .selectAll('.c1rect_back')
    .data(function(d) {
      return d.newvalues;
    });
  back_rect
    .enter()
    .append('rect')
    .attr('class', function(d) {
      return 'c1rect_back c1rect_back-' + d.i;
    })
    .merge(back_rect)
    .attr('x', function(d) {
      return c1x(d.n + 1) - 3;
    })
    .attr('y', function(d) {
      return c1y(d.i) - 3;
    })
    .attr('width', 8)
    .attr('height', 26)
    .style('fill', 'rgba(0,0,0,0)')
    .style('stroke', 'rgba(0,0,0,0)')
    .style('opacity', c1rectO)
    .on('mouseover', function(d) {
      g.selectAll('.c1label-' + d.i + ', .c1label_count-' + d.i).style(
        'font-weight',
        'bold'
      );
      if (c1rectO === 1) c1tip.show(d);
    })
    .on('mouseout', function(d) {
      g.selectAll('.c1label-' + d.i + ', .c1label_count-' + d.i).style(
        'font-weight',
        'normal'
      );
      c1tip.hide();
    });
  back_rect.exit().remove();
}

function caseone_update(index, prev) {
  var g = d3.select('.group');
  var rect = g.selectAll('.c1rects');
  var actual = g.selectAll('.c1act');
  var expected = g.selectAll('.c1exp');
  var connect = g.selectAll('.c1connect');
  var text_count = g.selectAll('.count');

  if (index === 0) {
    g.selectAll('.c1rects:not(.c1rect-' + leader + ')')
      .transition()
      .duration(250)
      .style('opacity', 1);
    g.selectAll('.label:not(.c1label-' + leader + ')')
      .transition()
      .duration(250)
      .style('opacity', 1);
    g.selectAll('.count:not(.c1label_count-' + leader + ')')
      .transition()
      .duration(250)
      .style('opacity', 1);
    caseone();
  } else if (index === 1) {
    c1rectO = 1;
    c1expO = 0;
    sortmode = 'descend_basic';
    if (prev === 0) {
      caseone();
      g.selectAll('.c1rects:not(.c1rect-' + leader + ')')
        .transition()
        .duration(250)
        .style('opacity', 0.1);
      g.selectAll('.label:not(.c1label-' + leader + ')')
        .transition()
        .duration(250)
        .style('opacity', 0.1);
      g.selectAll('.count:not(.c1label_count-' + leader + ')')
        .transition()
        .duration(250)
        .style('opacity', 0.1);
    } else if (prev === 2) {
      caseone();
      rect
        .transition()
        .duration(500)
        .delay(function(d) {
          return d.n * 3;
        })
        .attr('y', function(d) {
          return c1y(d.i);
        })
        .attr('height', 20)
        .style('opacity', 1);
      g.selectAll('rect:not(.c1rect-' + leader + ')')
        .transition()
        .duration(250)
        .delay(1000)
        .style('opacity', 0.1);
      g.selectAll('.label:not(.c1label-' + leader + ')')
        .transition()
        .duration(250)
        .delay(1000)
        .style('opacity', 0.1);
      g.selectAll('.count:not(.c1label_count-' + leader + ')')
        .transition()
        .duration(250)
        .delay(1000)
        .style('opacity', 0.1);
      d3.selectAll('.c1act, .c1exp, .c1connect, .label_expected, .label_actual')
        .transition()
        .duration(500)
        .style('opacity', c1expO);
      d3.selectAll('.legend_case1_phase1')
        .transition()
        .style('opacity', c1rectO);
      d3.selectAll('.legend_case1_phase2')
        .transition()
        .style('opacity', c1expO);
    } else {
      caseone();
      rect
        .transition()
        .duration(500)
        .delay(function(d) {
          return d.n * 3;
        })
        .attr('y', function(d) {
          return c1y(d.i);
        })
        .attr('height', 20)
        .style('opacity', 1);
      d3.selectAll('.legend_case1_phase1')
        .transition()
        .style('opacity', c1rectO);
      d3.selectAll('.legend_case1_phase2')
        .transition()
        .style('opacity', c1expO);
    }
  } else if (index === 2) {
    if (prev === 1) {
      c1rectO = 0;
      c1expO = 0.1;
    } else {
      c1rectO = 0;
      c1expO = 1;
    }
    sortmode = 'descend_basic';

    d3.select('#showMoreC1')
      .transition()
      .style('opacity', 0)
      .style('display', 'block');
    d3.selectAll('.legend_case1_phase1')
      .transition()
      .style('opacity', 0);
    d3.selectAll('.legend_case1_phase2')
      .transition()
      .style('opacity', 1);
    caseone();
  } else if (index === 3) {
    c1rectO = 0;
    c1expO = 1;
    sortmode = 'descend_diff';

    $('.filter-container').removeClass('ishidden');
    if (!small_screen)
      d3.select('#showMoreC1')
        .style('display', 'block')
        .transition()
        .style('opacity', 1);
    d3.selectAll('.legend_case1_phase1')
      .transition()
      .style('opacity', 0);
    d3.selectAll('.legend_case1_phase2')
      .transition()
      .style('opacity', 1);

    $('#switch_actual').removeClass('isactive');
    $('#switch_high_diff').addClass('isactive');
    $('#switch_low_diff').removeClass('isactive');

    caseone();
    if (prev === 2 && !casetwodrawn) casetwo(true);
  } else if (index === 5) {
  } else if (index === 6) {
    caseone();
  } else if (index === 7) {
    c1rectO = 0;
    c1expO = 1;
    sortmode = 'descend_diff';
    d3.selectAll('.legend_case1_phase1')
      .transition()
      .style('opacity', c1rectO);
    d3.selectAll('.legend_case1_phase2')
      .transition()
      .style('opacity', c1expO);
    caseone();
  } else if (index === 8) {
    c1rectO = 0;
    c1expO = 1;
    sortmode = 'ascend_diff';
    d3.selectAll('.legend_case1_phase1')
      .transition()
      .style('opacity', c1rectO);
    d3.selectAll('.legend_case1_phase2')
      .transition()
      .style('opacity', c1expO);
    caseone();
  }
}

function casetwo(first) {
  if (first) {
    start = 1870;
    end = 2018;
    level = 'all-levels';
    league = 'all-leagues';
  }
  casetwodrawn = true;
  var filter = filters[level][league],
    rank,
    adjRank,
    searchedRank,
    searchedAdjRank;

  d3.select('#selected_filters')
    .text(level + ' / ' + league + ' / ' + start + '-' + end)
    .style('opacity', 1);

  var data = case2data;
  data.forEach(function(d) {
    var teams = 0,
      results = 0,
      titles = 0;
    d.seasons.sort(function(a, b) {
      return d3.ascending(+a.season, +b.season);
    });
    d.newseasons = d.seasons.filter(function(d) {
      return d.season >= start && d.season <= end;
    });
    d.newseasons.forEach(function(d) {
      d.newteams = d.teams.filter(function(d) {
        return $.inArray(d.sport, filter) > -1;
      });
      d.newteams.forEach(function(d) {
        teams += 1;
        if (d.result != 'season') results += 1;
        if (d.result === 'title') titles += 1;
      });
    });
    d.newseasons = d.newseasons.filter(function(d) {
      return d.newteams.length > 0;
    });
    d.teams = teams;
    d.results = results;
    d.titles = titles;
    d.conversion = titles / d.newseasons.length;
    if (isNaN(d.conversion)) d.conversion = 0;
  });
  data = data.filter(function(d) {
    return d.results > 0 || d.metro === local || d.metro === searched;
  });
  if (
    sortmode2 === 'ascend_max_dryspell' ||
    sortmode2 === 'descend_max_dryspell'
  ) {
    if (
      filter != 'mls' &&
      filter != 'cfl' &&
      filter != 'soccer_w' &&
      filter != 'volleyball_w'
    )
      data = data.filter(function(d) {
        return (
          d.newseasons.length > 24 || d.metro === local || d.metro === searched
        );
      });
  } else {
    // data = data;
  }
  data = dynasties_and_droughts(data);
  data.sort(function(a, b) {
    if (sortmode2 === 'descend_seasons')
      return (
        d3.descending(+a.newseasons.length, +b.newseasons.length) ||
        d3.ascending(a.metro, b.metro)
      );
    if (sortmode2 === 'descend_results')
      return (
        d3.descending(+a.results, +b.results) || d3.ascending(a.metro, b.metro)
      );
    if (sortmode2 === 'descend_teams')
      return (
        d3.descending(+a.teams, +b.teams) || d3.ascending(a.metro, b.metro)
      );
    if (sortmode2 === 'descend_titles')
      return (
        d3.descending(+a.titles, +b.titles) || d3.ascending(a.metro, b.metro)
      );
    if (sortmode2 === 'descend_conversion_seasons')
      return (
        d3.descending(+a.conversion, +b.conversion) ||
        d3.ascending(a.metro, b.metro)
      );
    if (sortmode2 === 'descend_max_dynasty')
      return (
        d3.descending(+a.max_dynasty, +b.max_dynasty) ||
        d3.descending(+a.titles, +b.titles) ||
        d3.ascending(a.metro, b.metro)
      );
    if (sortmode2 === 'descend_max_prettygooddynasty')
      return (
        d3.descending(+a.max_prettygooddynasty, +b.max_prettygooddynasty) ||
        d3.descending(+a.titles, +b.titles) ||
        d3.ascending(a.metro, b.metro)
      );
    if (sortmode2 === 'descend_max_dryspell')
      return (
        d3.descending(+a.dryseasons.length, +b.dryseasons.length) ||
        d3.descending(+a.titles, +b.titles) ||
        d3.ascending(a.metro, b.metro)
      );
    if (sortmode2 === 'ascend_max_dryspell')
      return (
        d3.ascending(+a.dryseasons.length, +b.dryseasons.length) ||
        d3.descending(+a.titles, +b.titles) ||
        d3.ascending(a.metro, b.metro)
      );
    if (sortmode2 === 'descend_total_dynasties')
      return (
        d3.descending(+a.dynasties.length, +b.dynasties.length) ||
        d3.descending(+a.titles, +b.titles) ||
        d3.ascending(a.metro, b.metro)
      );
    if (sortmode2 === 'descend_total_dryspells')
      return (
        d3.descending(+a.dryspells.length, +b.dryspells.length) ||
        d3.descending(+a.titles, +b.titles) ||
        d3.ascending(a.metro, b.metro)
      );
    if (sortmode2 === 'descend_total_prettygooddynasties')
      return (
        d3.descending(
          +a.prettygooddynasties.length,
          +b.prettygooddynasties.length
        ) ||
        d3.descending(+a.titles, +b.titles) ||
        d3.ascending(a.metro, b.metro)
      );
  });
  data.forEach(function(d, i) {
    if (d.metro === local) rank = i;
    if (d.metro === searched) searchedRank = i;
  });
  data2 = data;

  adjRank = rank;
  searchedAdjRank = 0;
  if (rank > case2num - 2) adjRank = case2num - 1;
  if (searchedRank < case2num) searchedAdjRank = searchedRank;
  if (searched === local && rank > case2num - 2) searchedAdjRank = adjRank;
  if (searchedRank > case2num - 1 && searchedAdjRank === 0) leader = 1;
  if (adjRank > case2num - 2) {
    var mainData = data.slice(0, case2num - 1);
  } else {
    var mainData = data.slice(0, case2num);
  }
  if (searchedRank > case2num - 2 && searched != local) {
    mainData = mainData.slice(0, mainData.length - 1);
  }
  if (
    searched != undefined &&
    searchedRank > case2num - 1 &&
    searched != local
  ) {
    var searchData = data.filter(function(d) {
      return d.metro === searched;
    });
    mainData = mainData.filter(function(d) {
      return d.metro != searched;
    });
    Array.prototype.push.apply(searchData, mainData);
    mainData = searchData;
  } else if (
    searched != undefined &&
    searchedRank === case2num - 1 &&
    searched != local
  ) {
    var searchData = data.filter(function(d) {
      return d.metro === searched;
    });
    mainData = mainData.filter(function(d) {
      return d.metro != searched;
    });
    Array.prototype.push.apply(mainData, searchData);
  }
  if (local != undefined && rank > case2num - 2) {
    var localData = data.filter(function(d) {
      return d.metro === local;
    });
    Array.prototype.push.apply(mainData, localData);
  }
  data = mainData;
  data.forEach(function(d, i) {
    d.newseasons.forEach(function(d) {
      var row = i;
      d.i = row;
      var y = d.season;
      d.newteams = d.newteams.filter(function(d) {
        return d.result != 'season';
      });
      d.newteams.sort(function(a, b) {
        return d3.descending(a.result, b.result);
      });
      d.newteams.forEach(function(d) {
        d.row = row;
        d.y = y;
      });
    });
    d.dynasties.forEach(function(d) {
      d.row = i;
    });
    d.prettygooddynasties.forEach(function(d) {
      d.row = i;
    });
    d.dryspells.forEach(function(d) {
      d.row = i;
    });
  });

  c2x = d3
    .scaleLinear()
    .domain([start, end])
    .range([150, sideD.w]);
  c2y = d3
    .scaleBand()
    .domain(d3.range(case2num))
    .range([0, case2num * h]);
  var xAxis = d3
    .axisTop(c2x)
    .tickFormat(d3.format(''))
    .tickSize(case2num * h);

  if (first) {
    var svg = d3
        .select('.case2 svg')
        .attr('width', sideD.w + sideD.left + sideD.right)
        .attr('height', case2num * h),
      legend = d3
        .select('#case2_header')
        .append('svg')
        .attr('width', sideD.w + sideD.left + sideD.right)
        .attr('height', h),
      g = svg
        .append('g')
        .attr('class', 'group2')
        .attr('transform', 'translate(' + sideD.left + ',' + sideD.top + ')'),
      legendg = legend.append('g');
    // .attr("transform", "translate(" + sideD.left + "," + sideD.top + ")");
    svg
      .append('g')
      .attr('class', 'x axis c2axis')
      .attr('transform', 'translate(' + sideD.left + ',' + case2num * h + ')')
      .call(xAxis);
    // legendg.selectAll(".legend_case2.circle")
    //   .data(events)
    //   .enter().append("circle").attr("class", "legend_case2 circle legend")
    //   .attr("cx", function(d, i) {
    //     if (d.event === "finals appearance") return 50
    //     if (d.event === "final four appearance") return 175
    //     return 0
    //   })
    //   .attr("cy", 0)
    //   .attr("r", 3)
    //   .style("fill", function(d) {
    //     return d.colour;
    //   })
    legendg
      .selectAll('.legend_case2.text')
      .data(events)
      .enter()
      .append('text')
      .attr('class', 'legend_case2 text legend')
      .attr('x', function(d, i) {
        if (d.event === 'finals appearance') return 50;
        if (d.event === 'final four appearance') return 175;
        return 0;
      })
      .attr('y', 10)
      .attr('dx', 0)
      .attr('dy', 4)
      .style('fill', function(d) {
        return d.colour;
      })
      .text(function(d) {
        return d.event;
      });
    g.append('rect')
      .attr('id', 'c2searchback')
      .attr('x', 0)
      .attr('y', c1y(0) - 5)
      .attr('width', sideD.w)
      .attr('height', h)
      .style('fill', dark_colour)
      .style('opacity', 0);
    if (local != undefined) {
      g.append('text')
        .attr('id', 'c2location')
        .attr('class', 'icon')
        .attr('x', function() {
          if (data[adjRank].newseasons[0].season === undefined)
            return (
              c2x(end) -
              getTextWidth(data[adjRank].metro, 'bold 13px aktiv-grotesk') -
              15
            );
          return (
            c2x(data[adjRank].newseasons[0].season) -
            getTextWidth(data[adjRank].metro, 'bold 13px aktiv-grotesk') -
            15
          );
        })
        .attr('y', c1y(adjRank))
        .attr('dy', 14)
        .style('text-anchor', 'end')
        .style('fill', accent_colour)
        .text('\uf124');
      g.select('.c2label-' + camelize(local)).style('font-weight', 'bold');
      g.append('line')
        .attr('id', 'c2locationLine')
        .attr('x1', function() {
          if (data[adjRank].newseasons[0].season === undefined)
            return (
              c2x(end) -
              getTextWidth(data[adjRank].metro, 'bold 13px aktiv-grotesk') -
              15
            );
          return (
            c2x(data[adjRank].newseasons[0].season) -
            getTextWidth(data[adjRank].metro, 'bold 13px aktiv-grotesk') -
            15
          );
        })
        .attr('x2', c2x(end))
        .attr('y1', c2y(adjRank) - 5)
        .attr('y2', c2y(adjRank) - 5)
        .style('opacity', 0)
        .style('stroke', 'rgba(255,255,255,0.5)');
    }
    g.append('text')
      .attr('id', 'c2searched')
      .attr('class', 'icon')
      .attr('x', -100)
      .attr('y', -100)
      .attr('dy', 14)
      .style('opacity', 0)
      .style('fill', accent_colour)
      .text('\uf002');
    if (adjRank > case2num - 2) {
      g.select('#c2locationLine')
        .transition()
        .style('opacity', 1);
    }
  } else {
    var svg = d3
        .select('.case2 svg')
        .transition()
        .attr('width', sideD.w + sideD.left + sideD.right)
        .attr('height', case2num * h),
      g = d3.select('.group2');
    d3.select('.c2axis')
      .transition()
      .attr('transform', 'translate(' + sideD.left + ',' + case2num * h + ')')
      .call(xAxis);
    if (searched != undefined) {
      g.select('#c2searchback')
        .transition()
        .attr('x', function() {
          var offset = 30;
          if (searched === local) offset = 45;
          if (data[searchedAdjRank].newseasons[0] === undefined)
            return (
              c2x(end) -
              getTextWidth(
                data[searchedAdjRank].metro,
                'bold 13px aktiv-grotesk'
              ) -
              offset
            );
          return (
            c2x(data[searchedAdjRank].newseasons[0].season) -
            getTextWidth(
              data[searchedAdjRank].metro,
              'bold 13px aktiv-grotesk'
            ) -
            offset
          );
        })
        .attr('y', c2y(searchedAdjRank) - 5)
        .attr('width', function() {
          var offset = 30;
          if (searched === local) offset = 45;
          if (data[searchedAdjRank].newseasons[0] === undefined)
            return (
              sideD.w -
              (c2x(end) -
                getTextWidth(
                  data[searchedAdjRank].metro,
                  'bold 13px aktiv-grotesk'
                ) -
                offset) +
              5
            );
          return (
            sideD.w -
            (c2x(data[searchedAdjRank].newseasons[0].season) -
              getTextWidth(
                data[searchedAdjRank].metro,
                'bold 13px aktiv-grotesk'
              ) -
              offset) +
            5
          );
        })
        .attr('height', h)
        .style('opacity', 1);
      g.select('#c2searched')
        .attr('x', function() {
          var offset = 25;
          if (searched === local) offset = 40;
          if (data[searchedAdjRank].newseasons[0] === undefined)
            return (
              c2x(end) -
              getTextWidth(
                data[searchedAdjRank].metro,
                'bold 13px aktiv-grotesk'
              ) -
              offset
            );
          return (
            c2x(data[searchedAdjRank].newseasons[0].season) -
            getTextWidth(
              data[searchedAdjRank].metro,
              'bold 13px aktiv-grotesk'
            ) -
            offset
          );
        })
        .attr('y', c1y(searchedAdjRank))
        .transition()
        .style('opacity', 1);
      g.selectAll('.label').style('font-weight', 'normal');
      g.select('.c2label-' + camelize(searched)).style('font-weight', 'bold');
    }
    if (local != undefined) {
      g.select('#c2location')
        .transition()
        .duration(500)
        .attr('x', function() {
          if (data[adjRank].newseasons[0] === undefined)
            return (
              c2x(end) -
              getTextWidth(data[adjRank].metro, 'bold 13px aktiv-grotesk') -
              15
            );
          return (
            c2x(data[adjRank].newseasons[0].season) -
            getTextWidth(data[adjRank].metro, 'bold 13px aktiv-grotesk') -
            15
          );
        })
        .attr('y', c2y(adjRank));
      g.select('.c2label-' + camelize(local)).style('font-weight', 'bold');
      if (adjRank > case2num - 2) {
        g.select('#c2locationLine')
          .transition()
          .attr('x1', function() {
            if (data[adjRank].newseasons[0] === undefined)
              return (
                c2x(end) -
                getTextWidth(data[adjRank].metro, 'bold 13px aktiv-grotesk') -
                15
              );
            return (
              c2x(data[adjRank].newseasons[0].season) -
              getTextWidth(data[adjRank].metro, 'bold 13px aktiv-grotesk') -
              15
            );
          })
          .attr('x2', c2x(end))
          .attr('y1', c2y(adjRank) - 5)
          .attr('y2', c2y(adjRank) - 5)
          .style('opacity', 1);
      } else {
        g.select('#c2locationLine')
          .transition()
          .style('opacity', 0);
      }
    }
  }

  if (first) svg.call(c2tip);

  var text = g.selectAll('.label').data(data, function(d) {
    return d.metro;
  });
  text
    .enter()
    .append('text')
    .attr('class', function(d, i) {
      return 'label c2label c2label-' + d.metro + ' c2label-' + i;
    })
    .attr('x', 0)
    .attr('y', function(d, i) {
      return c2y(i);
    })
    .attr('dy', 14)
    .style('text-anchor', 'end')
    .style('opacity', 0)
    .text(function(d) {
      return d.metro;
    })
    .merge(text)
    .attr('class', function(d, i) {
      return 'label c2label c2label-' + d.metro + ' c2label-' + i;
    })
    .transition()
    .duration(500)
    .attr('x', function(d) {
      if (d.newseasons[0] === undefined) return c2x(end);
      return c2x(d.newseasons[0].season) - 10;
    })
    .attr('y', function(d, i) {
      return c2y(i);
    })
    .style('opacity', 1)
    .style('font-weight', function(d) {
      if (d.metro === local || d.metro === searched) return 'bold';
      return 'normal';
    })
    .style('fill', function(d) {
      if (d.metro === local || d.metro === searched) return accent_colour;
      if (d.titles > 0) return '#fff';
      return light_colour;
    });
  text
    .exit()
    .transition()
    .duration(500)
    .attr('y', sideD.h)
    .style('opacity', 0)
    .remove();

  var back = g.selectAll('.back').data(data);
  back
    .enter()
    .append('rect')
    .merge(back)
    .attr('class', function(d, i) {
      return 'back c2back-' + i;
    })
    .attr('x', 0)
    .attr('y', function(d, i) {
      return c1y(i);
    })
    .attr('width', sideD.w)
    .attr('height', h)
    .style('fill', 'rgba(0,0,0,0)')
    .on('mouseover', function(d, i) {
      d3.select('.c2label-' + i).style('font-weight', 'bold');
    })
    .on('mouseout', function(d, i) {
      if (d.metro != local && d.metro != searched)
        d3.select('.c2label-' + i).style('font-weight', 'normal');
    });
  back.exit().remove();

  var group = g.selectAll('.c2rect').data(data);
  group
    .enter()
    .append('g')
    .attr('class', 'c2rect')
    .merge(group);
  group.exit().remove();

  var rect = g
    .selectAll('.c2rect')
    .selectAll('.season')
    .data(function(d, i) {
      return d.newseasons;
    });
  rect
    .enter()
    .append('line')
    .attr('class', 'season')
    .attr('x1', function(d) {
      return c2x(d.season);
    })
    .attr('y1', function(d) {
      return c2y(d.i) + 10;
    })
    .attr('x2', function(d) {
      return c2x(d.season);
    })
    .attr('y2', function(d) {
      return c2y(d.i) + 10;
    })
    .style('stroke-linecap', 'round')
    .style('stroke', '#444')
    .style('stroke-width', 5)
    .style('opacity', 0)
    .merge(rect)
    .transition()
    .duration(500)
    .delay(function(d, i) {
      return i;
    })
    .attr('x1', function(d) {
      return c2x(d.season);
    })
    .attr('y1', function(d) {
      return c2y(d.i) + 10;
    })
    .attr('x2', function(d) {
      return c2x(d.season + 1);
    })
    .attr('y2', function(d) {
      return c2y(d.i) + 10;
    })
    .style('opacity', 1);
  rect
    .exit()
    .transition()
    .duration(500)
    .delay(function(d, i) {
      return i;
    })
    .attr('x2', function(d) {
      return c2x(d.season);
    })
    .style('opacity', 0)
    .remove();

  var subgroup = g
    .selectAll('.c2rect')
    .selectAll('.c2subrect')
    .data(function(d) {
      return d.newseasons;
    });
  subgroup
    .enter()
    .append('g')
    .attr('class', 'c2subrect')
    .merge(subgroup);
  subgroup.exit().remove();

  var subrect = g
    .selectAll('.c2rect')
    .selectAll('.c2subrect')
    .selectAll('.result')
    .data(function(d) {
      return d.newteams;
    });
  subrect
    .enter()
    .append('circle')
    .attr('class', 'result')
    .attr('cx', function(d) {
      return c2x(d.y);
    })
    .attr('cy', function(d, i) {
      return c2y(d.row) + 10 - i * 4;
    })
    .attr('r', 2)
    .style('opacity', 0)
    .style('fill', '#444')
    .merge(subrect)
    .transition()
    .duration(500)
    .delay(function(d, i) {
      return i;
    })
    .attr('cx', function(d) {
      return c2x(d.y);
    })
    .attr('cy', function(d, i) {
      return c2y(d.row) + 10 - i * 4;
    })
    .attr('r', radius(end - start))
    .style('opacity', 1)
    .style('fill', function(d) {
      return event_colours(d.result);
    });
  subrect
    .exit()
    .transition()
    .duration(500)
    .style('opacity', 0)
    .remove();

  var tiprect = g
    .selectAll('.c2rect')
    .selectAll('.tiprect')
    .data(function(d) {
      return d.newseasons;
    });
  tiprect
    .enter()
    .append('rect')
    .attr('class', 'tiprect')
    .attr('x', function(d) {
      return c2x(d.season - 0.5);
    })
    .attr('y', function(d) {
      return c2y(d.i) - 10;
    })
    .attr('width', function(d) {
      return c2x(d.season + 0.5) - c2x(d.season - 0.5);
    })
    .attr('height', function(d) {
      return h;
    })
    .style('fill', 'rgba(0,0,0,0)')
    .style('opacity', function(d) {
      if (d.dry) return 0;
      return 1;
    })
    .merge(tiprect)
    .attr('x', function(d) {
      return c2x(d.season - 0.5);
    })
    .attr('y', function(d) {
      return c2y(d.i) - 10;
    })
    .attr('width', function(d) {
      return c2x(d.season + 0.5) - c2x(d.season - 0.5);
    })
    .attr('height', function(d) {
      return h;
    })
    .on('mouseover', function(d) {
      d3.select('.c2label-' + d.i).style('font-weight', 'bold');
      if (d.newteams.length > 0) c2tip.show(d);
    })
    .on('mouseout', function(d) {
      if (d.metro != local && d.metro != searched)
        d3.select('.c2label-' + d.i).style('font-weight', 'normal');
      c2tip.hide();
    });
  tiprect.exit().remove();

  if (sortmode2 === 'descend_max_dynasty') {
    var dyn_rect = g
      .selectAll('.c2rect')
      .selectAll('.dyn_rect')
      .data(function(d) {
        return d.dynasties;
      });
  } else if (sortmode2 === 'descend_max_prettygooddynasty') {
    var dyn_rect = g
      .selectAll('.c2rect')
      .selectAll('.dyn_rect')
      .data(function(d) {
        return d.prettygooddynasties;
      });
  } else if (
    sortmode2 === 'ascend_max_dryspell' ||
    sortmode2 === 'descend_max_dryspell'
  ) {
    var dyn_rect = g
      .selectAll('.c2rect')
      .selectAll('.dyn_rect')
      .data(function(d) {
        return d.dryspells;
      });
  }

  if (
    sortmode2 === 'descend_max_dynasty' ||
    sortmode2 === 'descend_max_prettygooddynasty' ||
    sortmode2 === 'descend_max_dryspell' ||
    sortmode2 === 'ascend_max_dryspell'
  ) {
    dyn_rect
      .enter()
      .append('line')
      .attr('class', 'dyn_rect')
      .attr('x1', function(d) {
        return c2x(d.start);
      })
      .attr('y1', function(d) {
        return c2y(d.row) + 15;
      })
      .attr('x2', function(d) {
        return c2x(d.start);
      })
      .attr('y2', function(d) {
        return c2y(d.row) + 15;
      })
      .style('stroke-linecap', 'round')
      .style('stroke', 'white')
      .style('stroke-width', 1.5)
      .style('opacity', 0)
      .merge(dyn_rect)
      .transition()
      .duration(500)
      .delay(function(d, i) {
        return i + 500;
      })
      .attr('x1', function(d) {
        return c2x(d.start);
      })
      .attr('y1', function(d) {
        return c2y(d.row) + 15;
      })
      .attr('x2', function(d) {
        return c2x(d.end);
      })
      .attr('y2', function(d) {
        return c2y(d.row) + 15;
      })
      .style('opacity', 1);
    dyn_rect
      .exit()
      .transition()
      .duration(500)
      .delay(function(d, i) {
        return i;
      })
      .attr('x1', function(d) {
        return c2x(d.end);
      })
      .style('opacity', 0)
      .remove();
  } else {
    g.selectAll('.c2rect')
      .selectAll('.dyn_rect')
      .transition()
      .duration(500)
      .delay(function(d, i) {
        return i;
      })
      .attr('x1', function(d) {
        return c2x(d.end);
      })
      .style('opacity', 0)
      .remove();
  }
}

function casetwo_update(index, prev) {
  if (index === 5) {
    sortmode2 = 'descend_seasons';

    if (prev === 4) {
      $('#lower-left').val(1870);
      $('#upper-left').val(2018);
      $('#filter-level').val('any');
      $('#filter-league').val('all leagues');
      d3.select('#filter-league').style('display', 'none');
      $('#filter-sport').val('all sports');
      d3.select('#filter-sport').style('display', 'none');

      start = 1870;
      end = 2018;
      level = 'all-levels';
      league = 'all-leagues';

      d3.select('#selected_filters')
        .text(level + ' / ' + league + ' / ' + start + '-' + end)
        .style('opacity', 1);

      $('.filter-container').addClass('ishidden');
      $('.filter-container').removeClass('isvisible');
    }

    casetwo();
  } else if (index === 6) {
    sortmode2 = 'descend_conversion_seasons';
    start = 1870;
    end = 1920;
    casetwo();
  } else if (index === 7) {
    start = 1920;
    end = 1970;
    casetwo();
  } else if (index === 8) {
    sortmode2 = 'descend_conversion_seasons';
    start = 1970;
    end = 2018;
    casetwo();
  } else if (index === 9) {
    sortmode2 = 'descend_max_dynasty';
    start = 1870;
    end = 2018;
    d3.select('#showMoreC2')
      .transition()
      .style('opacity', 0)
      .style('display', 'none');
    casetwo();
  } else if (index === 10) {
    sortmode2 = 'ascend_max_dryspell';
    $('.filter-container').removeClass('ishidden');
    if (!small_screen)
      d3.select('#showMoreC2')
        .style('display', 'block')
        .transition()
        .style('opacity', 1);
    casetwo();
  }
}

function casethree(first) {
  if (first) {
    start = 1870;
    end = 2018;
    level = 'all-levels';
    league = 'all-leagues';
  }
  var filter = filters[level][league],
    rank,
    adjRank,
    searchedRank,
    searchedAdjRank,
    total_titles = 0,
    total_pop = 0,
    x_axis_translateY = sideD.h / 2 + 15;
  leader = 0;

  var data = case3data;
  data.forEach(function(d) {
    d.values = d.values.sort(function(a, b) {
      return d3.ascending(+a.year, +b.year);
    });
    d.newvalues = d.values.filter(function(d) {
      return (
        d.year >= start && d.year <= end && $.inArray(d.sport, filter) > -1
      );
    });
    total_titles += d.newvalues.length;
    total_pop += d.population;
  });
  data = data.filter(function(d) {
    return d.newvalues.length > 0 || d.key === local || d.key === searched;
    // return d.newvalues.length > 0
  });
  data.forEach(function(d) {
    // if (d.newvalues.length > 0) {
    d.tlq = d.newvalues.length / d.population / (total_titles / total_pop);
    if (d.tlq === 0) d.tlq = 0;
    // } else {
    //   d.tlq = 1
    // }
  });
  data = data.sort(function(a, b) {
    if (sortmode3 === 'descend_tlq')
      return (
        d3.descending(+a.tlq, +b.tlq) ||
        d3.descending(+a.newvalues.length, +b.newvalues.length) ||
        d3.ascending(a.key, b.key)
      );
    if (sortmode3 === 'ascend_tlq')
      return (
        d3.ascending(+a.tlq, +b.tlq) ||
        d3.descending(+a.newvalues.length, +b.newvalues.length) ||
        d3.ascending(a.key, b.key)
      );
    if (sortmode3 === 'ascend_population')
      return (
        d3.ascending(+a.population, +b.population) || d3.ascending(a.key, b.key)
      );
  });
  data.forEach(function(d, i) {
    if (d.key === local) rank = i;
    if (d.key === searched) searchedRank = i;
  });
  data3 = data;

  adjRank = rank;
  searchedAdjRank = 0;
  if (rank > case3num - 2) adjRank = case3num - 1;
  if (searchedRank < case3num) searchedAdjRank = searchedRank;
  if (searched === local && rank > case3num - 2) searchedAdjRank = adjRank;
  if (
    local != undefined &&
    searched != local &&
    searchedAdjRank === case3num - 1
  )
    searchedAdjRank = 0;
  if (searchedRank > case3num - 1 && searchedAdjRank === 0) leader = 1;

  if (
    c3status != 'first' &&
    c3status != 'scatter_basic' &&
    c3status != 'scatter_tlq'
  ) {
    // if (filter != "mls" && filter != "cfl" && filter != "soccer_w" && filter != "volleyball_w") data = data.filter(function(d) {
    //   return d.local_seasons > 24 || d.key === local || d.key === searched;
    // })
    if (adjRank > case3num - 2) {
      var mainData = data.slice(0, case3num - 1);
    } else {
      var mainData = data.slice(0, case3num);
    }
    if (searchedRank > case3num - 2 && searched != local) {
      mainData = mainData.slice(0, mainData.length - 1);
    }
    if (
      searched != undefined &&
      searchedRank > case3num - 2 &&
      searched != local
    ) {
      var searchData = data.filter(function(d) {
        return d.key === searched;
      });
      mainData = mainData.filter(function(d) {
        return d.key != searched;
      });
      Array.prototype.push.apply(searchData, mainData);
      mainData = searchData;
    }
    if (local != undefined) {
      var localData = data.filter(function(d) {
        return d.key === local;
      });
      if (rank > case3num - 2) Array.prototype.push.apply(mainData, localData);
    }
    data = mainData;
  }

  c3y = d3.scaleLinear();
  c3r = d3
    .scaleLinear()
    .domain([0, 200])
    .range([3, 3]);
  c3x = d3
    .scaleLinear()
    .domain([0, 22000000])
    .range([50, sideD.w - 50]);
  c3c = d3
    .scaleLinear()
    .domain([0, 0.5, 1, 10, 120])
    .range(['#d7191c', '#fdae61', '#ffffbf', '#abd9e9', '#2c7bb6']);

  var xAxis = d3
    .axisBottom(c3x)
    .tickSize(0)
    .tickFormat(d3.format('.2s'))
    .tickValues([
      2000000,
      4000000,
      6000000,
      8000000,
      10000000,
      12000000,
      14000000,
      16000000,
      18000000,
      20000000,
      22000000
    ]);
  var yAxis = d3
    .axisLeft(c3y)
    .tickFormat(function(d) {
      if (d === 80) return d + ' titles';
      return d;
    })
    .tickSize(-sideD.w - 50);

  if (c3status === 'first') {
    c3y.domain([0, 0]).range([sideD.h / 2, sideD.h / 2]);
    yAxis.tickFormat('');
  } else if (c3status === 'scatter_basic') {
    x_axis_translateY = sideD.h;
    c3y.domain([0, 80]).range([sideD.h - 25, 0]);
  } else if (c3status === 'scatter_tlq') {
    d3.select('#showMoreC3')
      .transition()
      .style('opacity', 0)
      .style('display', 'none');
    x_axis_translateY = sideD.h;
    c3y.domain([0, 80]).range([sideD.h - 25, 0]);
    c3r
      .domain([
        0,
        1,
        15,
        d3.max(data, function(d) {
          return d.tlq;
        })
      ])
      .range([1, 3, 8, 10]);
    d3.select('.xlabel')
      .transition()
      .style('opacity', 1);
  } else if (
    c3status === 'ordering' ||
    c3status === 'ordered_over' ||
    c3status === 'ordered_under'
  ) {
    if (!small_screen)
      d3.select('#showMoreC3')
        .style('display', 'block')
        .transition()
        .style('opacity', 1);
    var extent = d3.extent(data, function(d) {
      return d.tlq;
    });
    c3x
      .domain([0, 1, 10, extent[1]])
      .range([sideD.left, sideD.w / 3, sideD.w * (3 / 6), sideD.w - 75]);
    c3y = d3
      .scaleBand()
      .domain(d3.range(case3num))
      .range([0, case3num * h]);
    c3r.domain([0, 1, 15, 120]).range([2, 5, 8, 10]);
    yAxis.tickSize(0).tickFormat('');
    xAxis.tickSize(0).tickFormat('');
    d3.select('.xlabel')
      .transition()
      .style('opacity', 0);
  }

  if (first) {
    var svg = d3
        .select('.case3')
        .append('svg')
        .attr('width', sideD.w + sideD.left + sideD.right)
        .attr('height', sideD.h + sideD.bottom + sideD.top),
      // .style("overflow", "visible"),
      legend = d3
        .select('#case3_header')
        .append('svg')
        .attr('width', sideD.w + sideD.left + sideD.right)
        .attr('height', h)
        .style('margin-bottom', '.5rem')
        .style('margin-top', '1rem'),
      grect = svg
        .append('g')
        .attr('class', 'grect')
        .attr('transform', 'translate(' + sideD.left + ',' + sideD.top + ')'),
      gbehind = svg
        .append('g')
        .attr('class', 'group3-behind')
        .attr('transform', 'translate(' + sideD.left + ',' + sideD.top + ')'),
      g = svg
        .append('g')
        .attr('class', 'group3')
        .attr('transform', 'translate(' + sideD.left + ',' + sideD.top + ')'),
      legendg = legend
        .append('g')
        .attr('class', 'c3legend')
        .attr('transform', 'translate(' + sideD.left + ')'),
      annotationg = svg
        .append('g')
        .attr('class', 'annotationg')
        .attr('transform', 'translate(' + sideD.left + ',' + sideD.top + ')'),
      noteg = svg
        .append('g')
        .attr('class', 'noteg')
        .attr('transform', 'translate(' + sideD.left + ',' + sideD.top + ')');
    svg
      .append('g')
      .attr('class', 'x axis c3axis')
      .attr('transform', 'translate(' + 25 + ',' + x_axis_translateY + ')')
      .call(xAxis)
      .append('text')
      .attr('class', 'xlabel')
      .attr('x', sideD.w / 2)
      .attr('y', 30)
      .style('text-anchor', 'middle')
      .text('Population');
    svg
      .append('g')
      .attr('class', 'y axis c3axis')
      .attr('transform', 'translate(' + 50 + ',' + sideD.top + ')')
      .call(yAxis);
  } else {
    if (
      c3status != 'first' &&
      c3status != 'scatter_basic' &&
      c3status != 'scatter_tlq'
    ) {
      var svg = d3
        .select('.case3 svg')
        .transition()
        .attr('width', sideD.w + sideD.left + sideD.right)
        .attr('height', case3num * h + 30);
    } else {
      var svg = d3
        .select('.case3 svg')
        .transition()
        .attr('width', sideD.w + sideD.left + sideD.right)
        .attr('height', sideD.h + sideD.bottom + sideD.top);
    }
    var g = d3.select('.group3'),
      legendg = d3.select('.c3legend'),
      gbehind = d3.select('.group3-behind'),
      grect = d3.select('.grect'),
      annotationg = d3.select('.annotationg'),
      noteg = d3.select('.noteg');
    svg
      .select('.x.axis.c3axis')
      .transition()
      .duration(250)
      .attr('transform', 'translate(' + 25 + ',' + x_axis_translateY + ')')
      .call(xAxis);
    svg
      .select('.y.axis.c3axis')
      .transition()
      .duration(250)
      .call(yAxis);
  }

  var circle = g.selectAll('.city-circle').data(data, function(d) {
    return d.key;
  });
  circle
    .enter()
    .append('circle')
    .attr('class', 'city-circle')
    .attr('cx', function(d) {
      if (
        c3status === 'first' ||
        c3status === 'scatter_basic' ||
        c3status === 'scatter_tlq'
      )
        return c3x(0);
      if (
        c3status === 'ordering' ||
        c3status === 'ordered_over' ||
        c3status === 'ordered_under'
      )
        return c3x(1);
    })
    .attr('cy', function(d, i) {
      if (c3status === 'first' || c3status === 'scatter_tlq')
        return c3y(d.newvalues.length);
      if (c3status === 'scatter_basic') return c3y(0);
      if (
        c3status === 'ordering' ||
        c3status === 'ordered_over' ||
        c3status === 'ordered_under'
      )
        return c3y(i) + h / 2;
    })
    .attr('r', function(d) {
      return 0;
    })
    .style('fill', function(d) {
      return c3c(d.tlq);
    })
    .style('opacity', 0)
    .merge(circle)
    .transition()
    .duration(function() {
      if (c3status === 'ordered_over' || c3status === 'ordered_under')
        return 500;
      return 250;
    })
    .delay(function(d, i) {
      if (c3status === 'first' || c3status === 'scatter_basic') return 250;
      if (c3status === 'scatter_tlq') return i * 10;
      return 0;
    })
    .attr('cx', function(d) {
      if (
        c3status === 'first' ||
        c3status === 'scatter_basic' ||
        c3status === 'scatter_tlq'
      )
        return c3x(d.population);
      if (c3status === 'ordering') return c3x(1);
      if (c3status === 'ordered_over' || c3status === 'ordered_under')
        return c3x(d.tlq);
    })
    .attr('cy', function(d, i) {
      if (c3status === 'first' || c3status === 'scatter_tlq')
        return c3y(d.newvalues.length);
      if (c3status === 'scatter_basic') return c3y(0);
      if (
        c3status === 'ordering' ||
        c3status === 'ordered_over' ||
        c3status === 'ordered_under'
      )
        return c3y(i) + h / 2;
    })
    .attr('r', function(d) {
      return c3r(d.tlq);
    })
    .transition()
    .duration(function(d) {
      if (c3status === 'scatter_basic') return 250 + d.newvalues.length;
      if (c3status === 'ordering') return 250;
      if (c3status === 'ordered_over' || c3status === 'ordered_under')
        return 500;
      return 0;
    })
    .delay(function(d, i) {
      if (c3status === 'scatter_basic') return 10 * i;
      if (c3status === 'ordering') return i * 50;
      return 0;
    })
    .attr('cx', function(d) {
      if (
        c3status === 'first' ||
        c3status === 'scatter_basic' ||
        c3status === 'scatter_tlq'
      )
        return c3x(d.population);
      if (
        c3status === 'ordering' ||
        c3status === 'ordered_over' ||
        c3status === 'ordered_under'
      )
        return c3x(d.tlq);
    })
    .attr('cy', function(d, i) {
      if (
        c3status === 'first' ||
        c3status === 'scatter_basic' ||
        c3status === 'scatter_tlq'
      )
        return c3y(d.newvalues.length);
      if (
        c3status === 'ordering' ||
        c3status === 'ordered_over' ||
        c3status === 'ordered_under'
      )
        return c3y(i) + h / 2;
    })
    .style('fill', function(d) {
      return c3c(d.tlq);
    })
    .style('opacity', function(d) {
      if (
        c3status === 'ordering' ||
        c3status === 'ordered_over' ||
        c3status === 'ordered_under'
      ) {
        if (d.tlq === 0) return 0;
        return 1;
      }
      return 1;
    });
  circle
    .exit()
    .transition()
    .duration(500)
    .style('opacity', 0)
    .remove();

  var annotations = [];

  if (
    c3status === 'first' ||
    c3status === 'scatter_basic' ||
    c3status === 'scatter_tlq'
  ) {
    var annotation1 = data.filter(function(d) {
        return d.key === 'New York Metro Area';
      })[0],
      annotation2 = data.filter(function(d) {
        return d.key === 'Greater Los Angeles, CA';
      })[0];
    if (annotation1 != undefined)
      annotations.push({
        note: {
          title: 'New York Metro Area',
          bgPadding: 20
        },
        x: annotation1.population,
        y: annotation1.newvalues.length,
        dx: -25,
        dy: -50
      });
    if (annotation2 != undefined)
      annotations.push({
        note: {
          title: 'Greater Los Angeles',
          bgPadding: 20
        },
        x: annotation2.population,
        y: annotation2.newvalues.length,
        dx: 25,
        dy: -25
      });
    if (
      local != undefined &&
      local != 'New York Metro Area' &&
      local != 'Greater Los Angeles, CA'
    ) {
      var localannotation = data.filter(function(d) {
        return d.key === local;
      })[0];
      annotations.push({
        note: {
          title: local,
          bgPadding: 20
        },
        className: 'annotation-local',
        x: localannotation.population,
        y: localannotation.newvalues.length,
        dx: 25,
        dy: -37.5
      });
    }
    if (
      searched != undefined &&
      searched != 'New York Metro Area' &&
      searched != 'Greater Los Angeles, CA'
    ) {
      var searchedannotation = data.filter(function(d) {
        return d.key === searched;
      })[0];
      annotations.push({
        note: {
          title: searched,
          bgPadding: 20
        },
        className: 'annotation-local',
        x: searchedannotation.population,
        y: searchedannotation.newvalues.length,
        dx: 25,
        dy: -62.5
      });
    }
  }

  if (c3status === 'first') {
    if (small_screen) {
      var large = 22000000,
        small = 0;
    } else {
      var large = 16000000,
        small = 6000000;
    }
    notes = [
      {
        note: {
          title: 'Larger Cities'
        },
        x: c3x(large),
        y: 25,
        dx: -25,
        dy: 0,
        color: accent_colour
      },
      {
        note: {
          title: 'Smaller Cities'
        },
        x: c3x(small),
        y: 25,
        dx: 25,
        dy: 0,
        color: accent_colour
      }
    ];
  } else if (c3status === 'scatter_basic' || c3status === 'scatter_tlq') {
    notes = [
      {
        note: {
          title: 'More titles per capita'
        },
        x: c3x(0),
        y: c3y(79),
        dx: 25,
        dy: 25,
        color: accent_colour
      }
    ];
  }

  annotations.forEach(function(d) {
    d.x = c3x(d.x);
    d.y = c3y(d.y);
    d.connector = {
      points: [[d.dx / 2, d.dy / 2 + d.dy / 5]]
    };
  });

  var makeAnnotations = d3
    .annotation()
    .textWrap(150)
    .type(curved_annotation);
  var makeNotes = d3
    .annotation()
    .textWrap(150)
    .type(note_annotation);

  if (c3status === 'first' && first) {
    makeAnnotations.annotations(annotations);
    annotationg.call(makeAnnotations);
    makeNotes.annotations(notes);
    noteg.call(makeNotes);
  } else if ((c3status === 'first') & !first) {
    makeAnnotations.annotations(annotations);
    makeAnnotations.update();
    annotationg.call(makeAnnotations);
    makeNotes.annotations(notes);
    makeNotes.update();
    noteg.call(makeNotes);
  } else if (c3status === 'scatter_basic') {
    makeAnnotations.annotations(annotations);
    makeNotes.annotations(notes);
    noteg.transition().style('opacity', 0);
    setTimeout(function() {
      makeAnnotations.update();
      makeNotes.update();
      annotationg
        .call(makeAnnotations)
        .style('opacity', 0)
        .transition()
        .duration(500)
        .delay(2000)
        .style('opacity', 1);
      noteg
        .call(makeNotes)
        .style('opacity', 0)
        .transition()
        .duration(500)
        .delay(1000)
        .style('opacity', 1);
    }, 250);
  } else if (c3status === 'scatter_tlq') {
    makeAnnotations.annotations(annotations);
    makeAnnotations.update();
    annotationg
      .call(makeAnnotations)
      .style('opacity', 0)
      .transition()
      .duration(500)
      .style('opacity', 1);
    makeNotes.annotations(notes);
    makeNotes.update();
    noteg
      .call(makeNotes)
      .style('opacity', 0)
      .transition()
      .duration(500)
      .style('opacity', 1);
  } else {
    annotationg.transition().style('opacity', 0);
    noteg.transition().style('opacity', 0);
  }

  noteg.selectAll('tspan').attr('dy', '1.25em');

  if (c3status === 'ordering') {
    legendg
      .selectAll('.c3_legend_phase2_circle')
      .data(c3r.domain())
      .enter()
      .append('circle')
      .attr('class', 'c3_legend_phase2_circle')
      .attr('cx', function(d, i) {
        if (d === 0) return c3x(1) - 21;
        if (d === 1) return c3x(1) - 9;
        if (d === 15) return c3x(1) + 9;
        return c3x(1) + 31;
      })
      .attr('cy', 24)
      .attr('r', function(d) {
        return c3r(d);
      })
      .style('fill', function(d) {
        return c3c(d);
      })
      .style('opacity', 0)
      .transition()
      .style('opacity', 1);
    legendg
      .append('text')
      .attr('class', 'c3_legend_phase2_text')
      .attr('x', c3x(1) - 25)
      .attr('y', 25)
      .attr('dx', -3)
      .attr('dy', 2)
      .style('text-anchor', 'end')
      .style('font-size', 10)
      .style('opacity', 0)
      .text('BELOW EXPECTATION')
      .transition()
      .style('opacity', 1);
    legendg
      .append('text')
      .attr('class', 'c3_legend_phase2_text fontawesome')
      .attr('x', c3x(1) + 135)
      .attr('y', 25)
      .attr('dy', 2)
      .style('text-anchor', 'start')
      .style('font-size', 10)
      .style('opacity', 0)
      .text('\uf178')
      .transition()
      .style('opacity', 1);
    legendg
      .append('text')
      .attr('class', 'c3_legend_phase2_text')
      .attr('x', c3x(1) + 40)
      .attr('y', 25)
      .attr('dx', 6)
      .attr('dy', 2)
      .style('text-anchor', 'start')
      .style('font-size', 10)
      .style('opacity', 0)
      .text('ABOVE EXPECTATION')
      .transition()
      .style('opacity', 1);
    legendg
      .append('text')
      .attr('class', 'c3_legend_phase2_text fontawesome')
      .attr('x', c3x(1) - 120)
      .attr('y', 25)
      .attr('dy', 2)
      .style('text-anchor', 'end')
      .style('font-size', 10)
      .style('opacity', 0)
      .text('\uf177')
      .transition()
      .style('opacity', 1);

    if (local != undefined) {
      g.append('text')
        .attr('id', 'c3location')
        .attr('class', 'icon')
        .attr('x', function() {
          if (localData[0].tlq > 1)
            return (
              c3x(1) -
              getTextWidth(localData[0].key, 'bold 13px aktiv-grotesk') -
              15
            );
          return (
            c3x(1) +
            getTextWidth(localData[0].key, 'bold 13px aktiv-grotesk') +
            15
          );
        })
        .attr('y', c3y(adjRank) + h / 2)
        .attr('dx', function() {
          if (localData[0].tlq > 1) return -12;
          return 12;
        })
        .attr('dy', 5)
        .style('text-anchor', 'end')
        .text('\uf124')
        .style('fill', accent_colour)
        .style('opacity', 0)
        .transition()
        .delay(1000)
        .style('opacity', 1);
      g.select('.label-' + camelize(local)).style('font-weight', 'bold');
      g.append('line')
        .attr('id', 'c3locationLine')
        .attr('x1', function() {
          if (localData[0].tlq > 1)
            return (
              c3x(1) -
              getTextWidth(localData[0].key, 'bold 13px aktiv-grotesk') -
              50
            );
          return (
            c3x(1) +
            getTextWidth(localData[0].key, 'bold 13px aktiv-grotesk') +
            50
          );
        })
        .attr('x2', c3x(localData[0].tlq))
        .attr('y1', c3y(adjRank))
        .attr('y2', c3y(adjRank))
        .style('opacity', 0);
    }
    g.append('text')
      .attr('id', 'c3searched')
      .attr('class', 'icon')
      .attr('x', -100)
      .attr('y', -100)
      .attr('dy', 5)
      .style('opacity', 0)
      .style('fill', accent_colour)
      .text('\uf002');
    if (adjRank > num - 2) {
      g.select('#c3locationLine')
        .transition()
        .delay(1000)
        .style('opacity', 1);
    }

    gbehind
      .append('rect')
      .attr('id', 'c3searchback')
      .attr('x', 0)
      .attr('y', c3y(0))
      .attr('width', sideD.w)
      .attr('height', h)
      .style('fill', dark_colour)
      .style('opacity', 0);
  } else if (c3status === 'ordered_over' || c3status === 'ordered_under') {
    if (searched != undefined) {
      gbehind
        .select('#c3searchback')
        .transition()
        .attr('x', 0)
        .attr('y', c3y(searchedAdjRank))
        .attr('width', sideD.w)
        .attr('height', h)
        .style('opacity', 1);
      g.select('#c3searched')
        .transition()
        .attr('x', function() {
          var adj = 25;
          if (searched === local) adj = 40;
          if (data[searchedAdjRank].tlq > 1)
            return (
              c3x(1) -
              getTextWidth(
                data[searchedAdjRank].key,
                'bold 13px aktiv-grotesk'
              ) -
              adj
            );
          return (
            c3x(1) +
            getTextWidth(data[searchedAdjRank].key, 'bold 13px aktiv-grotesk') +
            adj
          );
        })
        .attr('y', c3y(searchedAdjRank) + h / 2)
        .attr('dx', function() {
          if (data[searchedAdjRank].tlq > 1) return -12;
          return 12;
        })
        .transition()
        .style('opacity', 1);
      g.selectAll('.label').style('font-weight', 'normal');
      g.select('.label-' + camelize(searched)).style('font-weight', 'bold');
    }
    if (local != undefined && adjRank != undefined) {
      g.select('#c3location')
        .transition()
        .duration(500)
        .attr('x', function() {
          if (data[adjRank] != undefined) {
            if (data[adjRank].tlq > 1)
              return (
                c3x(1) -
                getTextWidth(data[adjRank].key, 'bold 13px aktiv-grotesk') -
                15
              );
            return (
              c3x(1) +
              getTextWidth(data[adjRank].key, 'bold 13px aktiv-grotesk') +
              15
            );
          }
          return c3x(1);
        })
        .attr('y', c3y(adjRank) + h / 2)
        .attr('dx', function() {
          if (data[adjRank] != undefined) {
            if (data[adjRank].tlq > 1) return -12;
          }
          return 12;
        })
        .style('opacity', function(d) {
          if (data[adjRank] != undefined) return 1;
          return 0;
        });
      g.select('.label-' + camelize(local)).style('font-weight', 'bold');
      if (adjRank > num - 2) {
        g.select('#c3locationLine')
          .transition()
          .attr('x1', function() {
            if (data[adjRank].tlq > 1)
              return (
                c3x(1) -
                getTextWidth(data[adjRank].key, 'bold 13px aktiv-grotesk') -
                50
              );
            return (
              c3x(1) +
              getTextWidth(data[adjRank].key, 'bold 13px aktiv-grotesk') +
              50
            );
          })
          .attr('x2', c3x(data[adjRank].tlq))
          .attr('y1', c3y(adjRank))
          .attr('y2', c3y(adjRank))
          .style('opacity', 1);
      } else {
        g.select('#c3locationLine')
          .transition()
          .style('opacity', 0);
      }
    } else {
      g.select('#c3locationLine')
        .transition()
        .style('opacity', 0);
      g.select('#c3location')
        .transition()
        .style('opacity', 0);
    }
  } else if (
    c3status != 'ordering' &&
    c3status != 'ordered_over' &&
    c3status != 'ordered_under'
  ) {
    d3.selectAll(
      '.c3_legend_phase2_text, .c3_legend_phase2_circle, #c3searchback, #c3searched, #c3location, #c3locationLine'
    )
      .transition()
      .style('opacity', 0)
      .remove();
  }

  if (
    c3status === 'ordering' ||
    c3status === 'ordered_over' ||
    c3status === 'ordered_under'
  ) {
    var connect = gbehind.selectAll('line').data(data, function(d) {
      return d.key;
    });
    connect
      .enter()
      .append('line')
      .attr('x1', c3x(1))
      .attr('y1', function(d, i) {
        return c3y(i) + h / 2;
      })
      .attr('x2', c3x(1))
      .attr('y2', function(d, i) {
        return c3y(i) + h / 2;
      })
      .style('opacity', 0)
      .merge(connect)
      .transition()
      .duration(function() {
        if (c3status === 'ordering') return 250;
        if (c3status === 'ordered_over' || c3status === 'ordered_under')
          return 500;
        return 0;
      })
      .delay(function(d, i) {
        if (c3status === 'ordering') return 50 * i;
        return 0;
      })
      .attr('x1', c3x(1))
      .attr('y1', function(d, i) {
        return c3y(i) + h / 2;
      })
      .attr('x2', function(d) {
        return c3x(d.tlq);
      })
      .attr('y2', function(d, i) {
        return c3y(i) + h / 2;
      })
      .style('stroke', function(d) {
        return c3c(d.tlq);
      })
      .style('opacity', function(d) {
        if (d.tlq === 0) return 0;
        return 1;
      })
      .style('stroke-width', 2)
      .style('stroke', function(d) {
        return c3c(d.tlq);
      });
    connect
      .exit()
      .transition()
      .duration(250)
      .style('opacity', 0)
      .remove();

    var text = g.selectAll('.label').data(data, function(d) {
      return d.key;
    });
    text
      .enter()
      .append('text')
      .attr('class', function(d, i) {
        return 'label label-' + i + ' label-' + camelize(d.key);
      })
      .attr('x', c3x(1))
      .attr('y', function(d, i) {
        return c3y(i) + h / 2;
      })
      .attr('dy', 5)
      .style('opacity', 0)
      .text(function(d) {
        return d.key;
      })
      .merge(text)
      .transition()
      .duration(500)
      .delay(function(d, i) {
        if (c3status === 'ordering') return 50 * i + 100;
        return 0;
      })
      .attr('class', function(d, i) {
        return 'label label-' + i + ' label-' + camelize(d.key);
      })
      .attr('x', c3x(1))
      .attr('y', function(d, i) {
        return c3y(i) + h / 2;
      })
      .attr('dx', function(d) {
        if (d.tlq > 1) return -12;
        return 12;
      })
      .style('text-anchor', function(d) {
        if (d.tlq > 1) return 'end';
        return 'start';
      })
      .style('fill', function(d) {
        if (d.key === local || d.key === searched) return accent_colour;
      })
      .text(function(d) {
        return d.key;
      })
      .style('opacity', function(d) {
        if (d.tlq === 0) return 0.25;
        return 1;
      });
    text
      .exit()
      .transition()
      .duration(250)
      .style('opacity', 0)
      .remove();

    var text_count = g.selectAll('.label-count').data(data, function(d) {
      return d.key;
    });
    text_count
      .enter()
      .append('text')
      .attr('class', function(d, i) {
        return 'label-count label-count-' + i;
      })
      .merge(text_count)
      .attr('class', function(d, i) {
        return 'label-count label-count-' + i;
      })
      .attr('x', function(d) {
        if (d.tlq > 1) return c3x(d.tlq) + c3r(d.tlq);
        return c3x(d.tlq) - c3r(d.tlq);
      })
      .attr('y', function(d, i) {
        return c3y(i) + h / 2;
      })
      .attr('dx', function(d) {
        if (d.tlq > 1) return 12;
        return -12;
      })
      .attr('dy', 5)
      .style('text-anchor', function(d) {
        if (d.tlq > 1) return 'start';
        return 'end';
      })
      .style('fill', function(d) {
        if (d.key === local || d.key === searched) return accent_colour;
      })
      .style('opacity', 0)
      .text(function(d) {
        return d.tlq.toFixed(1) + 'x';
      });
    text_count.exit().remove();

    var rect = grect.selectAll('rect').data(data);
    rect
      .enter()
      .append('rect')
      .merge(rect)
      .attr('x', 0)
      .attr('y', function(d, i) {
        return c3y(i);
      })
      .attr('width', sideD.w)
      .attr('height', h)
      .style('fill', 'rgba(0,0,0,0)')
      .on('mouseover', function(d, i) {
        d3.select('.label-count-' + i).style('opacity', 1);
        d3.select('.label-' + i).style('font-weight', 'bold');
      })
      .on('mouseout', function() {
        d3.selectAll('.label-count').style('opacity', 0);
        d3.selectAll('.label').style('font-weight', 'normal');
        if (local != undefined)
          d3.select('.label-' + camelize(local)).style('font-weight', 'bold');
        if (searched != undefined)
          d3.select('.label-' + camelize(searched)).style(
            'font-weight',
            'bold'
          );
      });
    rect.exit().remove();
  } else {
    gbehind
      .selectAll('line')
      .transition()
      .duration(250)
      .style('opacity', 0)
      .remove();
    g.selectAll('.label')
      .transition()
      .duration(250)
      .style('opacity', 0)
      .remove();
    g.selectAll('.label-count').remove();
    grect.selectAll('rect').remove();
  }
} // end casethree

function casethree_update(index, prev) {
  if (index === 11) {
    c3status = 'first';
    if (prev === 10) {
      $('#lower-left').val(1870);
      $('#upper-left').val(2018);
      $('#filter-level').val('any');
      $('#filter-league').val('all leagues');
      d3.select('#filter-league').style('display', 'none');
      $('#filter-sport').val('all sports');
      d3.select('#filter-sport').style('display', 'none');

      start = 1870;
      end = 2018;
      level = 'all-levels';
      league = 'all-leagues';

      d3.select('#selected_filters')
        .text(level + ' / ' + league + ' / ' + start + '-' + end)
        .style('opacity', 1);

      $('.filter-container').addClass('ishidden');
      $('.filter-container').removeClass('isvisible');
    }
    casethree();
  } else if (index === 12) {
    c3status = 'scatter_basic';
    casethree();
  } else if (index === 13) {
    c3status = 'scatter_tlq';
    d3.select('#showMoreC3')
      .transition()
      .style('opacity', 0)
      .style('display', 'none');
    casethree();
  } else if (index === 14) {
    if (prev === 13) c3status = 'ordering';
    if (prev === 15) c3status = 'ordered_over';
    sortmode3 = 'descend_tlq';
    $('.filter-container').removeClass('ishidden');
    if (!small_screen)
      d3.select('#showMoreC3')
        .style('display', 'block')
        .transition()
        .style('opacity', 1);
    casethree();
    c3status = 'ordered_over';
    if (!wrapupdrawn) wrapup(true);
    // sortmode = "descend_diff";
    // caseone();
  } else if (index === 15) {
    c3status = 'ordered_under';
    sortmode3 = 'ascend_tlq';
    casethree();
    if (!wrapupdrawn) wrapup();
  }
}

function wrapupData(set, data, sort) {
  if (set === 'one') {
    data.forEach(function(d) {
      d.differential = d.newvalues.length - d.expected;
    });
  }
  data = data.sort(function(a, b) {
    if (set === 'one' && sort === 'basic')
      return d3.descending(+a.differential, +b.differential);
    if (set === 'two' && sort === 'basic')
      return d3.descending(+a.conversion, +b.conversion);
    if (set === 'three' && sort === 'basic')
      return d3.descending(+a.tlq, +b.tlq);
  });
  data.forEach(function(d, i) {
    d.rank = i + 1;
  });
  data = data.slice(0, 10);
  return data;
}

function searchWrapUpData(set, data) {
  if (local != undefined && searched != undefined) var term = searched;
  if (local != undefined && searched === undefined) var term = local;
  if (local === undefined && searched != undefined) var term = searched;
  var searchdata = data.filter(function(d) {
    if (set == 'one' || set === 'three') return d.key === term;
    return d.metro === term;
  });
  if (set === 'one') {
    if (searchdata[0].i > 10)
      return {
        data: searchdata,
        searchdata: searchdata
      };
  } else {
    if (searchdata[0].rank > 10)
      return {
        data: searchdata,
        searchdata: searchdata
      };
  }
  return {
    data: [],
    searchdata: searchdata
  };
}

function wrapup(first) {
  wrapupdrawn = true;
  var wh = 20;
  var y = d3
      .scaleBand()
      .domain(d3.range(12))
      .range([0, 12 * wh]),
    opacity = d3
      .scaleLinear()
      .domain([0, 10])
      .range([1, 0.25]);

  if (local != undefined) {
    $('#wrapup-local').html(local);
  } else {
    $('#wrapup-local').html('');
    $('#wrapuph1').css('opacity', 1);
  }

  data1top = wrapupData('one', data1, 'basic');
  data2top = wrapupData('two', data2, 'basic');
  data3top = wrapupData('three', data3, 'basic');

  if (first) {
    var svg1 = d3
        .select('#case1list')
        .append('svg')
        .attr('width', 250)
        .attr('height', (10 + 2) * wh),
      svg2 = d3
        .select('#case2list')
        .append('svg')
        .attr('width', 250)
        .attr('height', (10 + 2) * wh),
      svg3 = d3
        .select('#case3list')
        .append('svg')
        .attr('width', 250)
        .attr('height', (10 + 2) * wh);
    var g1 = svg1
        .append('g')
        .attr('class', 'g1')
        .attr('transform', 'translate(' + 0 + ',' + 10 + ')'),
      g2 = svg2
        .append('g')
        .attr('class', 'g2')
        .attr('transform', 'translate(' + 0 + ',' + 10 + ')'),
      g3 = svg3
        .append('g')
        .attr('class', 'g3')
        .attr('transform', 'translate(' + 0 + ',' + 10 + ')');
  } else {
    var svg1 = d3.select('#case1list svg'),
      svg2 = d3.select('#case2list svg'),
      svg3 = d3.select('#case3list svg'),
      g1 = d3.select('.g1'),
      g2 = d3.select('.g2'),
      g3 = d3.select('.g3');
  }

  if (searched != undefined || local != undefined) {
    var data1search = searchWrapUpData('one', data1);
    var data2search = searchWrapUpData('two', data2);
    var data3search = searchWrapUpData('three', data3);

    Array.prototype.push.apply(data1top, data1search.data);
    Array.prototype.push.apply(data2top, data2search.data);
    Array.prototype.push.apply(data3top, data3search.data);

    g1.append('line')
      .attr('x1', 0)
      .attr('x2', 200)
      .attr('y1', y(10))
      .attr('y2', y(10))
      .style('stroke-width', 1)
      .style('opacity', 0)
      .transition()
      .style('opacity', 1);
    g2.append('line')
      .attr('x1', 0)
      .attr('x2', 200)
      .attr('y1', y(10))
      .attr('y2', y(10))
      .style('stroke-width', 1)
      .style('opacity', 0)
      .transition()
      .style('opacity', 1);
    g3.append('line')
      .attr('x1', 0)
      .attr('x2', 200)
      .attr('y1', y(10))
      .attr('y2', y(10))
      .style('stroke-width', 1)
      .style('opacity', 0)
      .transition()
      .style('opacity', 1);

    var term = local;
    if (searched != undefined) term = searched;
    if (term != 'New York Metro Area')
      term = term.substring(0, term.length - 4);

    if (
      data1search.searchdata[0].newvalues.length > 0 &&
      data2search.searchdata[0].conversion > 0
    ) {
      if (
        data1search.searchdata[0].rank > 3 &&
        data2search.searchdata[0].rank > 3 &&
        data3search.searchdata[0].rank > 3
      )
        $('#wrapup-conclusion').html(
          "it’s definitely not <span class='offsetcolour'>" + term + '</span>.'
        );
      if (
        data1search.searchdata[0].rank < 4 ||
        data2search.searchdata[0].rank < 4 ||
        data3search.searchdata[0].rank < 4
      )
        $('#wrapup-conclusion').html(
          "it might be <span class='offsetcolour'>" + term + '</span>.'
        );
      if (
        data1search.searchdata[0].rank < 2 ||
        data2search.searchdata[0].rank < 2 ||
        data3search.searchdata[0].rank < 2
      )
        $('#wrapup-conclusion').html(
          "it could probably be <span class='offsetcolour'>" + term + '</span>.'
        );
      if (
        data1search.searchdata[0].rank < 2 &&
        data2search.searchdata[0].rank < 2 &&
        data3search.searchdata[0].rank < 2
      )
        $('#wrapup-conclusion').html(
          "it’s definitely <span class='offsetcolour'>" + term + '</span>.'
        );
    } else {
      $('#wrapup-conclusion').html(
        "it’s probably not <span class='offsetcolour'>" + term + '</span>.'
      );
    }
  } else {
    svg1
      .selectAll('line')
      .transition()
      .style('opacity', 0)
      .remove();
    svg2
      .selectAll('line')
      .transition()
      .style('opacity', 0)
      .remove();
    svg3
      .selectAll('line')
      .transition()
      .style('opacity', 0)
      .remove();
  }

  var text1 = g1.selectAll('.city').data(data1top, function(d) {
    return d.key;
  });
  text1
    .enter()
    .append('text')
    .attr('class', 'city')
    .attr('x', -25)
    .attr('y', function(d, i) {
      return y(i) + wh / 2;
    })
    .style('opacity', 0)
    .merge(text1)
    .transition()
    .duration(500)
    .attr('class', function(d) {
      return 'city wu1-city-' + camelize(d.key);
    })
    .attr('x', 20)
    .attr('y', function(d, i) {
      return y(i) + wh / 2;
    })
    .attr('dy', function(d, i) {
      if (i === 10) return 7;
    })
    .style('opacity', function(d, i) {
      return opacity(i);
    })
    .style('font-weight', function(d) {
      if (d.key === searched) return 'bold';
      return 'normal';
    })
    .style('fill', function(d) {
      if (d.key === searched || d.key === local) return '#FF6A68';
      if (d.key != searched && d.key != local && d.local_seasons < 1)
        return 'none';
      return 'white';
    })
    .style('text-decoration', function(d) {
      if (d.local_seasons < 1) return 'line-through';
      return 'none';
    })
    .text(function(d) {
      return (
        d.key +
        ' (' +
        (d.differential < 0 ? '' : '+') +
        d.differential.toString().substr(0, 4) +
        ')'
      );
    });
  text1
    .exit()
    .transition()
    .duration(500)
    .attr('y', (num + 2) * wh)
    .style('opacity', 0)
    .remove();

  var placement1 = g1.selectAll('.placement').data(data1top, function(d) {
    return d.key;
  });
  placement1
    .enter()
    .append('text')
    .attr('class', 'placement')
    .attr('x', -25)
    .attr('y', function(d, i) {
      return y(i) + wh / 2;
    })
    .attr('text-anchor', 'end')
    .attr('dx', 0)
    .style('opacity', 0)
    .merge(placement1)
    .transition()
    .duration(500)
    .attr('x', 18)
    .attr('y', function(d, i) {
      return y(i) + wh / 2;
    })
    .attr('dy', function(d, i) {
      if (i === 10) return 6;
      return -1;
    })
    .attr('dx', 0)
    .attr('text-anchor', 'end')
    .style('opacity', function(d, i) {
      if (d.expected < 1) return 0;
      return opacity(i);
    })
    .text(function(d, i) {
      if (i > 0 && d.differential === data1[i - 1].differential) return '';
      return d.i + '.';
    });
  placement1
    .exit()
    .transition()
    .duration(500)
    .attr('y', (num + 2) * wh)
    .style('opacity', 0)
    .remove();

  var text2 = g2.selectAll('.city').data(data2top, function(d) {
    return d.metro;
  });
  text2
    .enter()
    .append('text')
    .attr('class', 'city')
    .attr('x', -25)
    .attr('y', function(d, i) {
      return y(i) + wh / 2;
    })
    .style('opacity', 0)
    .merge(text2)
    .transition()
    .duration(500)
    .attr('class', function(d) {
      return 'city wu-city-' + camelize(d.metro);
    })
    .attr('x', 20)
    .attr('y', function(d, i) {
      return y(i) + wh / 2;
    })
    .attr('dy', function(d, i) {
      if (i === 10) return 7;
    })
    .style('opacity', function(d, i) {
      return opacity(i);
    })
    .style('font-weight', function(d) {
      if (d.metro === searched) return 'bold';
      return 'normal';
    })
    .style('text-decoration', function(d) {
      if (d.conversion === 0) return 'line-through';
      return 'none';
    })
    .style('fill', function(d) {
      if (d.metro === searched || d.metro === local) return '#FF6A68';
      return 'white';
    })
    .text(function(d) {
      return d.metro + ' (' + (d.conversion * 100).toFixed(1) + '%)';
    });
  text2
    .exit()
    .transition()
    .duration(500)
    .attr('y', (num + 2) * wh)
    .style('opacity', 0)
    .remove();

  var placement2 = g2.selectAll('.placement').data(data2top, function(d) {
    return d.metro;
  });
  placement2
    .enter()
    .append('text')
    .attr('class', 'placement')
    .attr('x', -25)
    .attr('y', function(d, i) {
      return y(i) + wh / 2;
    })
    .attr('text-anchor', 'end')
    .style('opacity', 0)
    .merge(placement2)
    .transition()
    .duration(500)
    .attr('x', 18)
    .attr('y', function(d, i) {
      return y(i) + wh / 2;
    })
    .attr('dy', function(d, i) {
      if (i === 10) return 6;
      return -1;
    })
    .attr('text-anchor', 'end')
    .style('opacity', function(d, i) {
      if (d.conversion === 0) return 0;
      return opacity(i);
    })
    .text(function(d, i) {
      if (
        i > 0 &&
        d.conversion.toFixed(2) === data2[i - 1].conversion.toFixed(2)
      )
        return '';
      return d.rank + '.';
    });
  placement2
    .exit()
    .transition()
    .duration(500)
    .attr('y', (num + 2) * wh)
    .style('opacity', 0)
    .remove();

  var text3 = g3.selectAll('.city').data(data3top, function(d) {
    return d.key;
  });
  text3
    .enter()
    .append('text')
    .attr('class', 'city')
    .attr('x', -25)
    .attr('y', function(d, i) {
      return y(i) + wh / 2;
    })
    .style('opacity', 0)
    .merge(text3)
    .transition()
    .duration(500)
    .attr('class', function(d) {
      return 'city wu-city-' + camelize(d.key);
    })
    .attr('x', 20)
    .attr('y', function(d, i) {
      return y(i) + wh / 2;
    })
    .attr('dy', function(d, i) {
      if (i === 10) return 7;
    })
    .style('opacity', function(d, i) {
      return opacity(i);
    })
    .style('font-weight', function(d) {
      if (d.key === searched) return 'bold';
      return 'normal';
    })
    .style('text-decoration', function(d) {
      if (d.newvalues.length < 1) return 'line-through';
      return 'none';
    })
    .style('fill', function(d) {
      if (d.key === searched || d.key === local) return '#FF6A68';
      return 'white';
    })
    .text(function(d) {
      return d.key + ' (' + d.tlq.toFixed(2) + 'x)';
    });
  text3
    .exit()
    .transition()
    .duration(500)
    .attr('y', (num + 2) * wh)
    .style('opacity', 0)
    .remove();

  var placement3 = g3.selectAll('.placement').data(data3top, function(d) {
    return d.key;
  });
  placement3
    .enter()
    .append('text')
    .attr('class', 'placement')
    .attr('x', -25)
    .attr('y', function(d, i) {
      return y(i) + wh / 2;
    })
    .attr('text-anchor', 'end')
    .style('opacity', 0)
    .merge(placement3)
    .transition()
    .duration(500)
    .attr('x', 18)
    .attr('y', function(d, i) {
      return y(i) + wh / 2;
    })
    .attr('dy', function(d, i) {
      if (i === 10) return 6;
      return -1;
    })
    .attr('text-anchor', 'end')
    .style('opacity', function(d, i) {
      if (d.newvalues.length < 1) return 0;
      return opacity(i);
    })
    .text(function(d, i) {
      if (i > 0 && d.tlq.toFixed(2) === data3[i - 1].tlq.toFixed(2)) return '';
      return d.rank + '.';
    });
  placement3
    .exit()
    .transition()
    .duration(500)
    .attr('y', (num + 2) * wh)
    .style('opacity', 0)
    .remove();

  d3.selectAll('.city')
    .on('mouseover', function(data) {
      var sele = data.key;
      if (data.key === undefined) sele = data.metro;
      d3.selectAll('.wu1-city-' + camelize(sele))
        .style('font-weight', 'bold')
        .style('opacity', 1);
      d3.selectAll('.wu-city-' + camelize(sele))
        .style('font-weight', 'bold')
        .style('opacity', 1);
    })
    .on('mouseout', function(data) {
      var sele = data.key;
      if (data.key === undefined) {
        sele = data.metro;
      }
      d3.selectAll('.wu1-city-' + camelize(sele))
        .style('font-weight', 'normal')
        .style('opacity', function(d, i) {
          var opa = d.i;
          if (opa > 10) opa = 10;
          return opacity(opa);
        });
      d3.selectAll('.wu-city-' + camelize(sele))
        .style('font-weight', 'normal')
        .style('opacity', function(d, i) {
          var opa = d.rank;
          if (opa > 10) opa = 10;
          return opacity(opa);
        });
    });
}

function dynasties_and_droughts(data) {
  data.forEach(function(d, i) {
    var index = i;
    var dynasties = {
        startyears: [],
        endyears: [],
        teams: [],
        dynasties: []
      },
      prettygooddynasties = {
        startyears: [],
        endyears: [],
        teams: [],
        prettygooddynasties: []
      },
      dryspells = {
        startyears: [],
        endyears: [],
        teams: [],
        dryspells: []
      };

    d.newseasons.forEach(function(d, i) {
      var title = false,
        prettygood = false,
        dry = true;
      d.newteams.forEach(function(d) {
        if (d.result === 'title') title = true;
        if (
          d.result === 'title' ||
          d.result === 'finals' ||
          d.result === 'finalFour'
        )
          prettygood = true;
      });
      if (title || prettygood) dry = false;
      d.title = title;
      d.prettygood = prettygood;
      d.dry = dry;
    });
    d.dynastyseasons = d.newseasons.filter(function(d) {
      return d.title === true;
    });
    d.prettygoodseasons = d.newseasons.filter(function(d) {
      return d.prettygood === true;
    });
    d.dryseasons = d.newseasons.filter(function(d) {
      return d.dry === true;
    });
    for (var n = 0; n < d.dynastyseasons.length; n++) {
      d.dynastyseasons[n].dynasty = false;
      if (
        n > 0 &&
        d.dynastyseasons[n - 1].season === d.dynastyseasons[n].season - 1
      )
        d.dynastyseasons[n].dynasty = true;
      if (
        n < d.dynastyseasons.length - 1 &&
        d.dynastyseasons[n + 1].season === d.dynastyseasons[n].season + 1
      )
        d.dynastyseasons[n].dynasty = true;
    }
    for (var n = 0; n < d.prettygoodseasons.length; n++) {
      d.prettygoodseasons[n].prettygood = false;
      if (
        n > 0 &&
        d.prettygoodseasons[n - 1].season === d.prettygoodseasons[n].season - 1
      )
        d.prettygoodseasons[n].prettygood = true;
      if (
        n < d.prettygoodseasons.length - 1 &&
        d.prettygoodseasons[n + 1].season === d.prettygoodseasons[n].season + 1
      )
        d.prettygoodseasons[n].prettygood = true;
    }
    for (var n = 0; n < d.dryseasons.length; n++) {
      d.dryseasons[n].dry = false;
      if (n > 0 && d.dryseasons[n - 1].season === d.dryseasons[n].season - 1)
        d.dryseasons[n].dry = true;
      if (
        n < d.dryseasons.length - 1 &&
        d.dryseasons[n + 1].season === d.dryseasons[n].season + 1
      )
        d.dryseasons[n].dry = true;
    }
    d.dynastyseasons = d.dynastyseasons.filter(function(d) {
      return d.dynasty === true;
    });
    d.prettygoodseasons = d.prettygoodseasons.filter(function(d) {
      return d.prettygood === true;
    });
    d.dryseasons = d.dryseasons.filter(function(d) {
      return d.dry === true;
    });
    for (var n = 0; n < d.dynastyseasons.length; n++) {
      var seasonteams = {
        year: d.dynastyseasons[n].season,
        teams: []
      };
      if (n === 0) d.dynastyseasons[n].status = 'start';
      if (
        n > 0 &&
        d.dynastyseasons[n].season - d.dynastyseasons[n - 1].season === 1
      )
        d.dynastyseasons[n].status = 'mid';
      if (
        n < d.dynastyseasons.length - 1 &&
        d.dynastyseasons[n + 1].season - d.dynastyseasons[n].season > 1
      )
        d.dynastyseasons[n].status = 'end';
      if (
        n > 0 &&
        d.dynastyseasons[n].season - d.dynastyseasons[n - 1].season > 1
      )
        d.dynastyseasons[n].status = 'start';
      if (n === d.dynastyseasons.length - 1) d.dynastyseasons[n].status = 'end';
      if (d.dynastyseasons[n].status === 'start')
        dynasties.startyears.push(d.dynastyseasons[n].season);
      if (d.dynastyseasons[n].status === 'end')
        dynasties.endyears.push(d.dynastyseasons[n].season);

      d.dynastyseasons[n].teams.forEach(function(d) {
        if (d.result === 'title') seasonteams.teams.push(d.team);
      });
      dynasties.teams.push(seasonteams);
    }
    for (var n = 0; n < d.prettygoodseasons.length; n++) {
      var seasonteams = {
        year: d.prettygoodseasons[n].season,
        teams: []
      };
      if (n === 0) d.prettygoodseasons[n].status = 'start';
      if (
        n > 0 &&
        d.prettygoodseasons[n].season - d.prettygoodseasons[n - 1].season === 1
      )
        d.prettygoodseasons[n].status = 'mid';
      if (
        n < d.prettygoodseasons.length - 1 &&
        d.prettygoodseasons[n + 1].season - d.prettygoodseasons[n].season > 1
      )
        d.prettygoodseasons[n].status = 'end';
      if (
        n > 0 &&
        d.prettygoodseasons[n].season - d.prettygoodseasons[n - 1].season > 1
      )
        d.prettygoodseasons[n].status = 'start';
      if (n === d.prettygoodseasons.length - 1)
        d.prettygoodseasons[n].status = 'end';
      if (d.prettygoodseasons[n].status === 'start')
        prettygooddynasties.startyears.push(d.prettygoodseasons[n].season);
      if (d.prettygoodseasons[n].status === 'end')
        prettygooddynasties.endyears.push(d.prettygoodseasons[n].season);

      d.prettygoodseasons[n].teams.forEach(function(d) {
        if (
          d.result === 'title' ||
          d.result === 'finals' ||
          d.result === 'finalFour'
        )
          seasonteams.teams.push(d.team);
      });
      prettygooddynasties.teams.push(seasonteams);
    }
    for (var n = 0; n < d.dryseasons.length; n++) {
      var seasonteams = {
        year: d.dryseasons[n].season,
        teams: []
      };
      if (n === 0) d.dryseasons[n].status = 'start';
      if (n > 0 && d.dryseasons[n].season - d.dryseasons[n - 1].season === 1)
        d.dryseasons[n].status = 'mid';
      if (
        n < d.dryseasons.length - 1 &&
        d.dryseasons[n + 1].season - d.dryseasons[n].season > 1
      )
        d.dryseasons[n].status = 'end';
      if (n > 0 && d.dryseasons[n].season - d.dryseasons[n - 1].season > 1)
        d.dryseasons[n].status = 'start';
      if (n === d.dryseasons.length - 1) d.dryseasons[n].status = 'end';
      if (d.dryseasons[n].status === 'start')
        dryspells.startyears.push(d.dryseasons[n].season);
      if (d.dryseasons[n].status === 'end')
        dryspells.endyears.push(d.dryseasons[n].season);

      d.dryseasons[n].teams.forEach(function(d) {
        if (
          d.result != 'title' &&
          d.result != 'finals' &&
          d.result != 'finalFour'
        )
          seasonteams.teams.push(d.team);
      });
      dryspells.teams.push(seasonteams);
    }
    dynasties.startyears.forEach(function(d, i) {
      var dynastyteams = [];
      for (var j = 0; j < dynasties.teams.length; j++) {
        if (
          dynasties.teams[j].year >= d &&
          dynasties.teams[j].year <= dynasties.endyears[i]
        )
          Array.prototype.push.apply(dynastyteams, dynasties.teams[j].teams);
      }
      var dynasty = {
        start: d,
        end: dynasties.endyears[i],
        time: dynasties.endyears[i] - d + 1,
        teams: Array.from(new Set(dynastyteams))
      };
      dynasties.dynasties.push(dynasty);
    });
    prettygooddynasties.startyears.forEach(function(d, i) {
      var dynastyteams = [];
      for (var j = 0; j < prettygooddynasties.teams.length; j++) {
        if (
          prettygooddynasties.teams[j].year >= d &&
          prettygooddynasties.teams[j].year <= prettygooddynasties.endyears[i]
        )
          Array.prototype.push.apply(
            dynastyteams,
            prettygooddynasties.teams[j].teams
          );
      }
      var dynasty = {
        start: d,
        end: prettygooddynasties.endyears[i],
        time: prettygooddynasties.endyears[i] - d + 1,
        teams: Array.from(new Set(dynastyteams))
      };
      prettygooddynasties.prettygooddynasties.push(dynasty);
    });
    dryspells.startyears.forEach(function(d, i) {
      var dynastyteams = [];
      for (var j = 0; j < dryspells.teams.length; j++) {
        if (
          dryspells.teams[j].year >= d &&
          dryspells.teams[j].year <= dryspells.endyears[i]
        )
          Array.prototype.push.apply(dynastyteams, dryspells.teams[j].teams);
      }
      var dynasty = {
        start: d,
        end: dryspells.endyears[i],
        time: dryspells.endyears[i] - d + 1,
        teams: Array.from(new Set(dynastyteams))
      };
      dryspells.dryspells.push(dynasty);
    });
    d.dynasties = dynasties.dynasties;
    d.prettygooddynasties = prettygooddynasties.prettygooddynasties;
    d.dryspells = dryspells.dryspells;
  });
  data.forEach(function(d) {
    d.dynasties.sort(function(a, b) {
      return d3.descending(+a.time, +b.time);
    });
    d.prettygooddynasties.sort(function(a, b) {
      return d3.descending(+a.time, +b.time);
    });
    d.dryspells.sort(function(a, b) {
      return d3.descending(+a.time, +b.time);
    });
    d.max_dynasty = 0;
    d.max_dryspell = 0;
    d.max_prettygooddynasty = 0;
    if (d.dynasties.length > 0) d.max_dynasty = d.dynasties[0].time;
    if (d.dryspells.length > 0) d.max_dryspell = d.dryspells[0].time;
    if (d.prettygooddynasties.length > 0)
      d.max_prettygooddynasties = d.prettygooddynasties[0].time;
  });
  data.sort(function(a, b) {
    if (sortmode2 === 'descend_max_dynasty')
      return (
        d3.descending(+a.max_dynasty, +b.max_dynasty) ||
        d3.descending(+a.titles, +b.titles) ||
        d3.ascending(a.metro, b.metro)
      );
    if (sortmode2 === 'descend_max_prettygooddynasty')
      return (
        d3.descending(+a.max_prettygooddynasty, +b.max_prettygooddynasty) ||
        d3.descending(+a.titles, +b.titles) ||
        d3.ascending(a.metro, b.metro)
      );
    if (sortmode2 === 'descend_max_dryspell')
      return (
        d3.descending(+a.dryseasons.length, +b.dryseasons.length) ||
        d3.descending(+a.titles, +b.titles) ||
        d3.ascending(a.metro, b.metro)
      );
    if (sortmode2 === 'ascend_max_dryspell')
      return (
        d3.ascending(+a.dryseasons.length, +b.dryseasons.length) ||
        d3.descending(+a.titles, +b.titles) ||
        d3.ascending(a.metro, b.metro)
      );
    if (sortmode2 === 'descend_total_dynasties')
      return (
        d3.descending(+a.dynasties.length, +b.dynasties.length) ||
        d3.descending(+a.titles, +b.titles) ||
        d3.ascending(a.metro, b.metro)
      );
    if (sortmode2 === 'descend_total_dryspells')
      return (
        d3.descending(+a.dryspells.length, +b.dryspells.length) ||
        d3.descending(+a.titles, +b.titles) ||
        d3.ascending(a.metro, b.metro)
      );
    if (sortmode2 === 'descend_total_prettygooddynasties')
      return (
        d3.descending(
          +a.prettygooddynasties.length,
          +b.prettygooddynasties.length
        ) ||
        d3.descending(+a.titles, +b.titles) ||
        d3.ascending(a.metro, b.metro)
      );
  });
  return data;
}

function getLocal() {
  var mindif = 99999;
  var closest;

  for (var i = 0; i < 4; i++) {
    d3.select('#intro-emoji-' + i)
      .transition()
      .duration(500)
      .delay(200 * i)
      .style('opacity', 1);
  }

  d3.csv('data/metros.csv', function(error, data) {
    if (error) console.log(error);
    metros = data;

    for (i = 0; i < metros.length; ++i) {
      var dif = PythagorasEquirectangular(
        local_coords[0],
        local_coords[1],
        parseArray(metros[i].lngLat)[1],
        parseArray(metros[i].lngLat)[0]
      );
      if (dif < mindif) {
        closest = i;
        mindif = dif;
      }
    }
    if (metros[closest] != undefined) local = metros[closest].metro;

    if (local != undefined) {
      // d3.select("#title-fade").transition().duration(500).style("color", light_colour)
      $('#title-fade').css('color', accent_colour);
      $('#citysearch-left').attr('value', local);
      $('#subtitle-user-city').html(
        "And how does <span class='offsetcolour'>" +
          local +
          '</span> compare to the winningest cities in North American sports?'
      );
      d3.select('#subtitle-user-city')
        .transition()
        .duration(1000)
        .delay(250)
        .style('opacity', 1);
      if (local === 'Greater Boston, MA')
        $('#worldseries-winner').html(
          'And now, with the Dodgers recent return to the World Series, I’m wondering, is it LA?'
        );
      if (local === 'Green Bay, WI') {
        $('#groundrules-user-city').html(
          "Or maybe it’s <span class='offsetcolour'>Green Bay, Wisconsin</span>"
        );
      } else {
        $('#groundrules-user-city').html(
          "Or maybe it’s <span class='offsetcolour'>" +
            local +
            '</span>? Or maybe Green Bay, Wisconsin'
        );
      }
    } else {
      $('#subtitle-user-city').html(
        'The Winningest Cities in North American Sports'
      );
      d3.select('#subtitle-user-city')
        .transition()
        .duration(500)
        .delay(100)
        .style('opacity', 1);
      $('#groundrules-user-city').html('Is it Green Bay, Wisconsin');
    }

    metros.forEach(function(metros) {
      searchArray.push(metros.metro);
    });
  });

  d3.selectAll('.intro-fade')
    .transition()
    .duration(1000)
    .delay(1250)
    .style('opacity', 1);
}

// SUPPLEMENTARY, MY DEAR WATSON
function camelize(str) {
  return str
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
      return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    })
    .replace(/\s+/g, '');
}

function parseArray(value) {
  return JSON.parse('[' + value + ']')[0];
}

function Deg2Rad(deg) {
  return (deg * Math.PI) / 180;
}

function PythagorasEquirectangular(lat1, lon1, lat2, lon2) {
  lat1 = Deg2Rad(lat1);
  lat2 = Deg2Rad(lat2);
  lon1 = Deg2Rad(lon1);
  lon2 = Deg2Rad(lon2);
  var R = 6371; // km
  var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
  var y = lat2 - lat1;
  var d = Math.sqrt(x * x + y * y) * R;
  return d;
}


function getTextWidth(text, font) {
  var canvas =
    getTextWidth.canvas ||
    (getTextWidth.canvas = document.createElement('canvas'));
  var context = canvas.getContext('2d');
  context.font = font;
  var metrics = context.measureText(text);
  return metrics.width;
}

function remove_duplicates(arr) {
  var obj = {};
  var ret_arr = [];
  for (var i = 0; i < arr.length; i++) {
    obj[arr[i]] = true;
  }
  for (var key in obj) {
    ret_arr.push(key);
  }
  return ret_arr;
}

function replaceSports(str) {
  return str
    .replace('mlb', 'MLB')
    .replace('nba', 'NBA')
    .replace('nfl', 'NFL')
    .replace('nhl', 'NHL')
    .replace('mls', 'MLS')
    .replace('cfl', 'CFL')
    .replace('baseball_m', 'Baseball (M)')
    .replace('basketball_w', 'Basketball (W)')
    .replace('basketball_m', 'Basketball (M)')
    .replace('football_m', 'Football (M)')
    .replace('soccer_w', 'Soccer (W)')
    .replace('volleyball_w', 'Volleyball (W)');
}

function filterConvert(league, level) {
  if (level === 'all-levels') return 'all sports';
  if (level === 'pro' && league === 'all-leagues') return 'pro sports';
  if (level === 'pro' && league === 'big4') return 'the big 4 leagues';
  if (level === 'pro' && league != 'all-leagues' && league != 'big4')
    return 'the ' + replaceSports(league);
  if (level === 'college' && league === 'all-sports') return 'college sports';
  if (level === 'college' && league != 'all-sports')
    return 'college ' + replaceSports(league);
}

//
