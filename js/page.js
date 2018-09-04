var currentActiveIdx = -1;
var imagesDoms = [];
var imageOffsets = [];
var globalSnapTop;
var globalSnapRight;

jQuery.fn.reverse = [].reverse;

// adjust the snap top position which default to the top of .image-column
var globalSnapAdjustment = 150;

// distance from .image-column to .content
var sectionOffset;

// states for smooth animation
var lastScrollTop;
var ticking = false;

$(document).ready(function() {
  // sectionOffset = $('.image-column').eq(0).offset().top - $('.content').eq(0).offset().top;
  // updateImageMaxHeight();

  $(window).scroll(function() { 
    lastScrollTop = window.scrollY;
    switchActive();
    // updateActiveElem();

    // requestTick();

    // clearTimeout($.data(this, 'scrollTimer'));
    // $.data(this, 'scrollTimer', setTimeout(function() {
    //   ticking = false;
    // }, 250));
  });

  $(window).resize(function() {
    var prevActive = currentActiveIdx;
    makeActive(-1);
    recordWindowSpacePositions();
    makeActive(prevActive);

    updateImageMaxHeight();
    updateImageHeights();
  }); 

  // when first image read
  $('.image-display').eq(0).ready(function() {
    recordWindowSpacePositions();
  });

  // set initial position and show image
  $('.image-column').children().each(function(idx) {
    var elem = $(this);
    imagesDoms.push(elem);
    imageOffsets.push({ top: 0, height: elem.height() == 0 ? 200 : elem.height() });
    anchorImage(elem, idx, true);

    // schedule to update height of elements that are not yet loaded at this time
    elem.children("img").eq(0).on('load', function() {
      sectionOffset = $('.image-column').eq(0).offset().top - $('.content').eq(0).offset().top;
      anchorImage(elem, idx, true);
      imageOffsets[idx].height = elem.height();
      imageOffsets[idx].top = elem.position().top;
    });
    elem.children("video").eq(0).on('loadedmetadata', function() {
      sectionOffset = $('.image-column').eq(0).offset().top - $('.content').eq(0).offset().top;
      anchorImage(elem, idx, true);
      imageOffsets[idx].height = elem.height();
      imageOffsets[idx].top = elem.position().top;
    });
  });
});

function anchorImage(elem, idx, verticalCenter) {
  var anchor = $('[anchor=' + (idx + 1) + ']');
  if (!anchor.length)
    anchor = $("#anchor" + (idx + 1));
  if (!anchor.length) {
    console.log("Couldn't find anchor for image " + (idx + 1));
    return;
  }

  var top = anchor.offset().top - $(".image-column").eq(0).offset().top;
  if (verticalCenter) {
    var anchorTextHeight = anchor.height();
    var imageHeight = elem.height();
    var verticalAlignmentAdjustment = (anchorTextHeight - imageHeight) / 2;
    top += verticalAlignmentAdjustment;
  }
  imageOffsets[idx].top = top;
  // elem.css('top', top);
  elem.css('opacity', 1);
}

function updateImageMaxHeight() {
  var maxImageHeight = Math.max(window.innerHeight - 44, 640) - 100;
  $('.image-display img').css('max-height', maxImageHeight);
  $('.image-display video').css('max-height', maxImageHeight);
}

function updateImageHeights() {
  $('.image-column').children().each(function(idx) {
    var elem = $(this);
    imageOffsets[idx].height = elem.height();
  });
}

function recordWindowSpacePositions() {
  // record the screen-space position for fixed positioning of active element
  globalSnapTop = $('.content').eq(0).offset().top - globalSnapAdjustment;
  var firstElem = $('.image-column').eq(0);
  globalSnapRight = $(window).width() - (firstElem.offset().left + firstElem.outerWidth());
}

function switchActive() {
  var nextActiveIdx = -1;
  for (var i = imagesDoms.length - 1; i >= 0; i--) {
    if (lastScrollTop - globalSnapAdjustment >= imageOffsets[i].top + sectionOffset) {
      nextActiveIdx = i;
      break;
    }
  }

  if (nextActiveIdx != currentActiveIdx)
    makeActive(nextActiveIdx);
}

function makeActive(nextIdx) {
  // when an alement becomes inactive, it changes from fixed to absolute positioning
  // so restore its right and top to values relative to the parent div
  if (currentActiveIdx != -1) {
    imagesDoms[currentActiveIdx].removeAttr('id');
    imagesDoms[currentActiveIdx].css('top', imageOffsets[currentActiveIdx].top);
    imagesDoms[currentActiveIdx].css('right', 0);
  }

  // when an element becomes active it uses fixed positioning
  // we update its right and top only once
  if (nextIdx != -1) {
    imagesDoms[nextIdx].attr('id', 'active-image');
    // imagesDoms[nextIdx].css('top', globalSnapTop);
    imagesDoms[nextIdx].css('right', globalSnapRight);
  }

  currentActiveIdx = nextIdx;
}

function updateActiveElem() {
  if (currentActiveIdx != -1) {
    // handle negative scroll
    if (lastScrollTop < 0)
      // $('#active-image').css('top', globalSnapTop - lastScrollTop);

    if (currentActiveIdx != -1 && currentActiveIdx < imageOffsets.length - 1) {
      var nextTopPos = imageOffsets[currentActiveIdx + 1].top + sectionOffset;
      var currBottomPos = lastScrollTop + imageOffsets[currentActiveIdx].height - globalSnapAdjustment;
      var distance = nextTopPos - currBottomPos;
      // $('#active-image').css('opacity', distance < 20 ? 0 : 1);
    }
  }
}

function perFrameUpdate() {
  requestAnimationFrame(perFrameUpdate);

  switchActive();
  // updateActiveElem();
}

function requestTick() {
  if (!ticking)
    requestAnimationFrame(perFrameUpdate);

  ticking = true;
}
