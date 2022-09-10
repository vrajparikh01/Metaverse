import Movements from "./movement.js";
import polygon from "./Web3.js";
import abi from "./abi/abi.json" assert {type : "json"};

const scene = new THREE.Scene();
// change the background of he scene
// scene.background = new THREE.Color(0xf1af32);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambient_light = new THREE.AmbientLight(0x404040);
const directional_light = new THREE.DirectionalLight( 0xffffff, 1 );
ambient_light.add(directional_light);
scene.add(ambient_light);

// create a surface
const geometry_area = new THREE.BoxGeometry( 100, 0.3, 60 );
const material_area = new THREE.MeshPhongMaterial( { color: 0xffffff } );
const area = new THREE.Mesh( geometry_area, material_area );
scene.add( area );

// create an cube (object)
// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

// create a cylinder
// const geometry_cyl = new THREE.CylinderGeometry(5, 5, 20, 32);
// const material_cyl = new THREE.MeshPhongMaterial({ color: 0xffff00 });
// const cylinder = new THREE.Mesh(geometry_cyl, material_cyl);
// scene.add(cylinder);
// cylinder.position.set(30, 5, 0);

// create a cone
// const geometry_cone = new THREE.ConeGeometry(5, 20, 32);
// const material_cone = new THREE.MeshPhongMaterial({ color: 0x1be3ef });
// const cone = new THREE.Mesh(geometry_cone, material_cone);
// scene.add(cone);
// cone.position.set(10, 5, 0);

camera.position.z = 5;
camera.position.set(10, 5, 40)

function animate() {
    // cube.rotation.x += 0.05;
    // cube.rotation.y += 0.05;
    // cube.rotation.z += 0.05;

    // cylinder.rotation.x += 0.05;
    // cylinder.rotation.y += 0.09;
    // // cylinder.rotation.z += 0.05;

    // cone.rotation.x += 0.05;
    // cone.rotation.y += 0.05;
    // cone.rotation.z += 0.05;

    // to move the cube in any direction
    camera.rotation.y -= 0.01;

	requestAnimationFrame( animate );

    // left key
    if(Movements.isPressed(37)){
        camera.position.x -= 0.5;
    }
    // up key
    if(Movements.isPressed(38)){
        // camera.position.x += 0.5;
        camera.position.y += 0.5;
    }
    // right key
    if(Movements.isPressed(39)){
        camera.position.x += 0.5;
    }
    // down key
    if(Movements.isPressed(40)){
        // camera.position.x -= 0.5;
        camera.position.y -= 0.5;
    }
    camera.lookAt(area.position);

	renderer.render( scene, camera );
}
animate();

// let renderer know about a particular scene and camera
renderer.render(scene, camera);

const button = document.querySelector('#mint');
button.addEventListener('click', mintNFT);

function mintNFT(){
    let nft_name = document.querySelector('#nft_name').value;
    let nft_height = document.querySelector('#nft_height').value;
    let nft_width = document.querySelector('#nft_width').value;
    let nft_depth = document.querySelector('#nft_depth').value;
    let nft_x = document.querySelector('#nft_x').value;
    let nft_y = document.querySelector('#nft_y').value;
    let nft_z = document.querySelector('#nft_z').value;

    if(typeof window.ethereum == 'undefined'){
        rej("Install Metamask");
    }

    let web3 = new Web3(window.ethereum);
    let contract = new web3.eth.Contract(abi, "0xe1f67d7dE3616fE729621075fA0d279C84febb7a");

    web3.eth.requestAccounts().then((accounts)=>{
        // send -> to change the state of contract (we give values to contract)
        contract.methods.mint(nft_name,nft_height,nft_width,nft_depth,nft_x,nft_y,nft_z).send({ from: accounts[0], value: "10", }).then((data)=>{
            console.log("NFT minted");
        });
    });
}

polygon.then((result)=>{
    result.nft.forEach((object, index)=>{
        const geometry_cone = new THREE.ConeGeometry(object.h, object.w, object.d);
        const material_cone = new THREE.MeshPhongMaterial({ color: 0x1be3ef });
        const nft = new THREE.Mesh(geometry_cone, material_cone);
        
        nft.position.set(object.x, object.y, object.z);
        scene.add(nft);
    });
});