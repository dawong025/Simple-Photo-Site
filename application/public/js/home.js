var photosLength; //used later to update 

function createPhotoCard(data, containerDiv){
    var subDiv = document.createElement("div"); //creates a sub div from container for img and p elements
    subDiv.id = data.id;
    var imgSRC = document.createElement("img");
    var pTitle = document.createElement("p");

    //sets src to the url, then assigns fixed h/w
    imgSRC.setAttribute("src",data.thumbnailUrl);
    imgSRC.style.height = "250px";
    imgSRC.style.width = "250px";

    pTitle.innerHTML = `${data.title}`;

    //append img and p to the sub div first, then append the sub div to the container div
    subDiv.appendChild(imgSRC);
    subDiv.appendChild(pTitle);

    containerDiv.appendChild(subDiv);

    //set a default opacity for the (sub) div, img, p
    subDiv.style.opacity = 1;
    imgSRC.style.opacity = 1;
    pTitle.style.opacity = 1;

    //fadeOut here utilizes the subdiv
    subDiv.onclick = function(event){
        /*  [for reference] from Discord as high level idea + a bit of stackoverflow
        ----------------------------------------------------------------------------
            -get div clicked
            -set default opacity
            -set interval and store in variable
                -if opacity is < 0
                    -clear
                    -remove
                    -update count
                -update opacity of element
                -update opacity
        */
        var targetDiv = event.currentTarget;
        var opacity = 1;
        let fadeEff = setInterval(function(){
            if(opacity < 0){
                clearInterval(fadeEff);

                //remove the sub div and update count / output at the top
                targetDiv.remove();
                photosLength--;

                //Minor formatting output
                if(photosLength > 1 || photosLength < 1){
                    document.getElementById("items-count").innerHTML = `There are ${photosLength} photos being shown`;
                }
                else{
                    document.getElementById("items-count").innerHTML = `There is ${photosLength} photo being shown`;
                }
            }
            targetDiv.style.opacity = opacity;
            opacity = opacity - 0.20;
        }, 40);
    };
}

let mainDiv = document.getElementById("container4");
if(mainDiv){
    let fetchURL = "https://jsonplaceholder.typicode.com/albums/2/photos"
    fetch(fetchURL)
    .then((data) => data.json())
    .then((photos) => {
        let innerHTML = "";
        photos.forEach((photo) => {
            createPhotoCard(photo,mainDiv); //container
        });
        photosLength = photos.length; //enables global counting usage instead

        //Minor formatting output
        if(photosLength > 1 || photosLength < 1){
            document.getElementById("items-count").innerHTML = `There are ${photosLength} photos being shown`;
        }
        else{
            document.getElementById("items-count").innerHTML = `There is ${photosLength} photo being shown`;
        }
    })
}

function setFlashMessageFadeOut(){
    setTimeout(() => {
        let currentOpacity = 1.0;
        let timer = setInterval(() => {
            if(currentOpacity < 0.05){
                clearInterval(timer);
                flashElement.remove();
            }
            currentOpacity = currentOpacity - 0.05;
            flashElement.style.opacity = currentOpacity;
        }, 50);
    }, 4000);
}

let flashElement = document.getElementById("flash-message");
if(flashElement){
    setFlashMessageFadeOut();
}