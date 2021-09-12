{
    const image = new Image(), takePhotoButton = document.querySelector('takePhoto');
    let contraints, imgCapture, mediaStream, video;

    // Puzzle Vars
    const markers = document.querySelectorAll('a-marker'), numCol = 3, numRow = 3, puzzlePieces = numCol * numRow, tolerance = 1.9;

    let imgPieces = new Array(puzzlePieces), puzzle = [...Array(puzzlePieces).keys()].map(String), pieces = numCol * numRow - 1, positionMarkers = [], chek = new Array(6);

    const init = () => {
        video = document.querySelector('video');
        navigator.mediaDevices.enumerateDevices().catch(error => console.log('enumerateDevices() error', error)).then(getStream);

        takePhotoButton.addEventListener('click', getPicture);
    }

    // Get a video stream from the camera
    const getStream = () => {
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
        } 

        contraints = {
            video: {
                width: 720,
                height: 720
            }   
        }

        navigator.mediaDevices.getUserMedia(contraints).catch(error => console.log('getUserMedia() error', error)).then(gotStream);
    };

    // Displayes the stream from the camera and then 
    // creates an ImageCapture object, using video from the stream
    const gotStream = stream => {
        mediaStream = stream;
        video.srcObject = stream;
        imageCapture = new ImageCapture(stream.getVideoTracks()[0])
    };

    // take the picture
    const getPicture = () => {
        shuffle(puzzle);
        imgCapture.takePhoto().then((img) => {
            image.src = URL.createObjectURL(img);
            image.addEventListener('load', () => createImagePieces(image));
            setInterval(() => checkDistance(), 1000);
        }).catch(error => console.log('takePhoto() error', error))
    };

    const createImagePieces = image => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const pieceWidth = image.width / numCol;
        const pieceHeight = image.height / numRow;
        
        for (let x = 0; x < numCol; x++) {
            for (let y = 0; y < numRow; y++) {
                
                ctx.drawImage(image, x * pieceWidth, y * pieceHeight, pieceWidth, pieceHeight, 0,0,canvas.width, canvas.height);
                imgPieces[8-pieces] = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
                pieces = pieces - 3;
                if (pieces < 0) {
                    pieces = (puzzlePieces - 1) + pieces;
                }
            }
        }
        markers.forEach((marker, i) => {
            const aImg = document.createElement('a-image');

            aImg.setAttribute('rotation', '-90 0 0');
            aImg.setAttribute('position', '0 0 0');
            aImg.setAttribute('src', imgPieces[puzzle[i]]);

            marker.appendChild(aImg);
        })
    }

    const shuffle = randomArray => {
        for (let i = randomArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            // let t = randomArray[i];
            // randomArray[i] = randomArray[j];
            // randomArray[j] = t;
            [randomArray[i], randomArray[j]] = [randomArray[j], randomArray[i]];
        }
        return randomArray;
    }
}