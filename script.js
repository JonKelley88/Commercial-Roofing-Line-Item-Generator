window.onload = function() {

  //store the original items to use for the reset button
  const originalRepairItems = Array.from(document.getElementById("repairItems").getElementsByTagName("li"));

  //    |||||   EVENTS   |||||

  // click to reset each item value to default
  document.getElementById("resetItem").addEventListener("click", function() {
    document.getElementById("repairItems").innerHTML = "";
    originalRepairItems.forEach(function(li) {
      li.firstChild.value = li.firstChild.defaultValue;
      document.getElementById("repairItems").appendChild(li);
    });
  }); // end of resetItem.click

  // click on add item to append blank input to items
  document.getElementById("addItem").addEventListener("click", function() {
    let li = document.createElement("li");
    li.innerHTML = `<input type="text" value=""></input><button class="itemClose">&times</button>`;
    document.getElementById("repairItems").appendChild(li);
    // add events to the new items
    repairEvents();
  }); // end of addItem.click

  // click to confirm the repair items
  document.getElementById("confirmItem").addEventListener("click", function() {
    // style changes
    document.getElementById("areaQuestion").style.display = "block";
    document.getElementById("setRepairItems").style.display = "none";
    document.getElementById("repairItems").style.color = "grey";

    Array.from(document.getElementById("repairItems").children).forEach(function(li) {
      // removes any items left blank
      if (li.children[0].value === "") {
        document.getElementById("repairItems").removeChild(li)
      }
    });

    // edit the steps text
    let stepOne = document.getElementById("step1");
    stepOne.removeChild(stepOne.children[1]);
    stepOne.style.color = "grey";
    document.getElementById("step2").style.display = "block";
  }); // end of confirmItem.click

  // click on submit function to append the amount of areas needed
  document.getElementById("areaSubmit").addEventListener("click", function() {
    // only run if the input for the roof areas amount has a number
    if (document.getElementById("areaAmount").value != "") {

      // variables
      let areaAmount = document.getElementById("areaAmount").value;
      let areaList = document.getElementById("areaList");
      let ul = document.createElement("ul");

      // clear any previously set areas and show the confirm button
      areaList.innerHTML = "";
      document.getElementById("confirmAreas").style.display = "inline";

      // populate the unordered list with each roof area
      for (let i = 0; i < areaAmount; i++) {
        let li = document.createElement("li");
        li.innerHTML = `<input type="text" value="RA #${i + 1}"></input><button class="areaAdd">&darr;</button><button class="areaClose">&times;</button>`;
        ul.appendChild(li);
      }

      // append the unordered list to the div
      ul.setAttribute("id", "areas");
      areaList.appendChild(ul);
      // clear the input after the user clicks
      document.getElementById("areaAmount").value = "";

      areaEvents();
    }
  }); // end of areaSubmit.click

  // click to confirm the roof areas after user sets them up
  document.getElementById("confirmAreas").addEventListener("click", function() {
    // only run if the user has created at least one roof area
    if (areas.innerHTML != "") {

      let areas = document.getElementById("areas");
      let newAreas = document.createElement("ul");

      document.getElementById("confirmAreaItems").style.display = "block";
      document.getElementById("areaQuestion").style.display = "none";

      // label and add an input to each roof area
      Array.from(areas.children).forEach(function(area) {
        let li = document.createElement("li");
        let roofArea = area.childNodes[0].value;
        let repairItemsInput = document.createElement("input");
        repairItemsInput.classList.add("repairItemsInput");

        // ignore any roof area fields that the user left blank
        if (roofArea != "") {
          li.innerHTML = roofArea;
          li.appendChild(repairItemsInput);
          newAreas.appendChild(li);
        }
      });

      areas.innerHTML = "";
      areas.appendChild(newAreas);


      // add the repair items to the reference display
      let itemDisplay = document.getElementById("itemDisplay");
      let repairList = document.createElement("ol");
      let repairItems = Array.from(document.getElementById("setRepairItems").children[1].children);
      repairItems.forEach(function(item) {
        let li = document.createElement("li");
        li.innerHTML = item.childNodes[0].value;
        repairList.appendChild(li);
      });
      itemDisplay.appendChild(repairList);
      itemDisplay.style.display = "block";

      // edit the steps text
      let stepTwo = document.getElementById("step2");
      stepTwo.removeChild(stepTwo.children[1]);
      stepTwo.style.color = "grey";
      document.getElementById("step3").style.display = "block";

      // move the text to the left to make it more readable for Step 4
      document.getElementById("left").style.textAlign = "left";

    }

  }); // end of confirmAreas.click

  // click to confirm which line items to add to each roof area
  document.getElementById("confirmAreaItems").addEventListener("click", function() {
    // variables
    let areas = document.getElementById("areas").children[0].children;
    let repairItems = Array.from(document.getElementById("setRepairItems").children[1].children).map(item => item.childNodes[0].value);
    let newAreas = document.createElement("div");

    // style changes
    itemDisplay.style.display = "none";
    document.getElementById("confirmAreaItems").style.display = "none";
    document.getElementById("generate").style.display = "block";

    Array.from(areas).forEach(function(area) {
      let areaItem = document.createElement("p");
      let areaName = area.childNodes[0].data;
      let areaItemList = document.createElement("ul");
      let areaItems = area.childNodes[1].value.split(" ").sort();
      // remove any blank spaces from the area items input to avoid running code on them
      areaItems = areaItems.filter(item => item != "");

      // add each line item category to each roof areas as specified by the user
      areaItems.forEach(function(num) {
        let li = document.createElement("li");

        // only add the item if it is on the item list from Step 1
        if (repairItems[num - 1] === undefined || num === " ") {} else {
          li.innerHTML = `${repairItems[num - 1]} (+/- <input class="itemAmount"></input> Locations)`;
          li.style.fontWeight = "normal";
          li.style.backgroundColor = "rgba(0,0,0,0.1)";
          areaItemList.appendChild(li);
        }
      }); // end of areaItems.forEach

      // if the roof area is left blank, add "General Maintenance"
      areaItem.innerHTML = `<b>${areaName}</b>`;
      if (areaItemList.children.length === 0) {
        let li = document.createElement("li");
        li.innerHTML = "General Maintenance";
        li.style.fontWeight = "normal";
        areaItemList.appendChild(li);
        areaItem.appendChild(areaItemList);
      } else {
        areaItem.appendChild(areaItemList);
      }
      newAreas.appendChild(areaItem);
    });

    document.getElementById("areas").innerHTML = "";
    document.getElementById("areas").appendChild(newAreas);

    // edit the steps text
    let stepThree = document.getElementById("step3");
    stepThree.removeChild(stepThree.children[1]);
    stepThree.style.color = "grey";
    document.getElementById("step4").style.display = "block";
  }); // end of confirmAreaItems.click

  // click to generate the plain text to copy
  document.getElementById("generate").addEventListener("click", function() {
    let roofAreas = document.getElementById("areas").children[0].children;

    // grab each roof area to see how many repair items are there
    Array.from(roofAreas).forEach(function(area) {
      let repairItems = area.children[1].children;
      let nonGenMain = Array.from(repairItems).filter(item => item.childNodes.length > 1);

      // replace each repair item input with the value as text
      nonGenMain.forEach(function(item) {
        let itemAmount = item.childNodes[1].value;
        let itemAmountNum = document.createTextNode(itemAmount);
        item.removeChild(item.childNodes[1]);
        item.insertBefore(itemAmountNum, item.childNodes[1]);
        item.style.backgroundColor = "white";
      });
    });

    // hide the generate button
    document.getElementById("generate").style.display = "none";

    // edit the steps text
    let stepFour = document.getElementById("step4");
    stepFour.removeChild(stepFour.children[1]);
    stepFour.style.color = "grey";
    document.getElementById("step5").style.display = "block";
  }); // end of generate.click

  //    |||||   FUNCTIONS   |||||

  // function to know which repair list item to remove
  function repairEvents() {
    let itemClosers = Array.from(document.getElementsByClassName("itemClose"));

    itemClosers.forEach(function(closer) {

      // add events to the newly added repair items
      closer.addEventListener("click", function() {

        // remove the node that the closer is in
        document.getElementById("repairItems").removeChild(closer.parentElement);
      });
    });
  } // end of repairEvents()

  // applies events to the roof area buttons and determines where to add/delete an area
  function areaEvents() {

    Array.from(areas.children).forEach(function(area, index) {

      // add event to the delete button
      area.childNodes[2].addEventListener("click", function() {
        let areas = updateAreas();
        // use the unique id on each closer button to know which dynamically added nodes to remove
        areas.removeChild(areas.children[area.childNodes[2].dataset.index]);
      });

      // add event to the arrow button
      area.childNodes[1].addEventListener("click", function() {
        let areas = updateAreas();
        let li = document.createElement("li");
        li.innerHTML = `<input type="text" value=""></input><button class="areaAdd areaAddOff">&darr;</button><button class="areaClose">&times;</button>`;
        let closer = li.childNodes[2];

        // add event to the closer button on the new li created by the arrow button
        closer.addEventListener("click", function() {
          let nodeToRemove = closer.parentElement;
          areas.removeChild(nodeToRemove);
        });
        areas.insertBefore(li, areas.children[Array.from(areas.children).indexOf(area) + 1]);
      });
    });
  } // end of areaEvents()

  // gets the current area node to use in the areaEvents function and applies a unique id to each closer button
  function updateAreas() {
    let closers = document.getElementsByClassName("areaClose");

    Array.from(closers).forEach(function(closer, index) {
      closer.dataset.index = index;
    });

    let areas = document.getElementById("areas");
    return areas;
  } // end of updateAreas()

  // add events to the repair items on document load
  repairEvents();
}
