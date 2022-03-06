const { API_KEY } = require("./api-key");
const { Game, convertCoordsToBBoxes } = require("@gathertown/gather-game-client");
const { setgroups } = require("process");
global.WebSocket = require("isomorphic-ws");
const game = new Game(() => Promise.resolve({ apiKey: API_KEY }));
game.connect("jEDZjhqoI4iAKolF\\OrigamiUSA"); // replace with your spaceId
game.subscribeToConnection((connected) => console.log("connected?", connected));
const mapId = "Origami Cafe"; //replace with your map of choice 

//images left at index 0, right at 1, up at 2, down at 3, then repeats with alternate forms for each direction
//this part looks gross, someone please tell me how to make it less gross if I wana add the other 3024982049 pokemon
let pokeball =
  "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/tY3NKLnSH19EEstnaZ6Ix5";
let Charmander =    
  ["https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/Gs2JPhCJJXGzFEegABNp7g",
  "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/nYQ0cEdRlQdMs6fu7FXVZd",
  "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/Tp75dv75IIAWdanFsPfxWG",
  "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/Del3VK7aCJhOUXHacVVDJl",
  "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/SWCKU6WP9Eky7yoIeOGqtL",
  "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/O4Ulzd5by5VNdbbKDIrFBj",
  "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/1hHwGrACK86OwGZjcrSC2W",
  "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/Rwv9YE7UjV42VFHBnmEvee"
];
let Squirtle =  //lots of placeholders
  ["https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/ggYDMTlJdsJGyFLA35O5pG", 
  "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/ohkujdHjBLKDcJQP2cWNHj",
  "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/ggYDMTlJdsJGyFLA35O5pG", 
  "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/ohkujdHjBLKDcJQP2cWNHj",
  "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/ggYDMTlJdsJGyFLA35O5pG", 
  "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/ohkujdHjBLKDcJQP2cWNHj",
  "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/ggYDMTlJdsJGyFLA35O5pG", 
  "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/ohkujdHjBLKDcJQP2cWNHj"
];
let Bulbasaur =     //lots of placeholders
  ["https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/d02kXkvXlC2WGgOrjfoO2v",
  "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/1f9c898TFKMl1fM2QSkN3w",
  "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/d02kXkvXlC2WGgOrjfoO2v",
  "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/1f9c898TFKMl1fM2QSkN3w",
  "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/d02kXkvXlC2WGgOrjfoO2v",
  "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/1f9c898TFKMl1fM2QSkN3w",
  "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/d02kXkvXlC2WGgOrjfoO2v",
  "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/1f9c898TFKMl1fM2QSkN3w"
];

//returns new x,y, and direction sprite should be facing for pokemon based on current location/movement
function getNewPokeLocation(x, y, direction){
  if(direction == 1 || direction ==2 ){     //down
    return [x, y-1, 3];
  }
  if(direction == 3 || direction ==4 ){   //up
    return [x, y+1, 2];
  }
  if(direction == 5 || direction ==6 ){   //left
    return [x+1, y, 0];
  }
  if(direction == 7 || direction ==8 ){    //right
    return [x-1, y, 1];
  }
}

//moves pokemon to follow u, returns nothing
function movePokemon(context){
  //make object
  let objectId = context.playerId +"Pokemon";
  let location = getNewPokeLocation(context.player.x, context.player.y, context.player.direction);  //index 0 is x and 1 is y. 2 is direction
  let state = 'normal';
  let imageLocation = eval(context.player.affiliation)[location[2]];

  //check if image should alternate
  if(game.getObject(objectId) != undefined){    //something something this gets mad at me if this is undefined and i try to move on
    if(game.getObject(objectId).obj.customState == 'normal' && context.player.affiliation == 'Charmander'){   //only charmander has all the sprites, check for that, remove second half if all your sprites have all 8 images
      imageLocation = eval(context.player.affiliation)[location[2]+4];
      state = 'walking'
    }
  }

  let obj = {
    id: objectId,
    normal: imageLocation,
    x: location[0],
    y: location[1],
    type: 0,
    width: 1,
    height: 1,
    customState: state
  }

  //add object
  setTimeout(() => {
  game.setObject(mapId, objectId, obj);
  },200);
}

function setUp(){
  let names = ["Charmander", "Squirtle", "Bulbasaur", "Put Away"];     //array with values, can add more pokemon if you have loaded in sprites

  //starting x and y for top left pokeball, the rest of the pokeballs will spawn to the right of the first one
  let startX = 27;
  let startY = 20;

  setTimeout(() => {
    for(let i=0; i<names.length; i++){
      let objectId = names[i] + "Ball";
      let obj = {
        id: objectId,
        normal: pokeball,
        x: startX + i, 
        y: startY,
        distThreshold: 1,
        type: 5, 
        width: 1, 
        height: 1, 
        previewMessage: names[i], // this is what shows up in the press x bubble
      };
    game.setObject(mapId, objectId, obj);
    }
  }, 3000); 
}

function pokemon(){
  game.subscribeToEvent("playerInteracts", (data, context) => {     //watch for pokemon choosing
    let mapObject = game.getObject(data.playerInteracts.objId).obj; 
    let pokePick = game.getObject(data.playerInteracts.objId).obj.previewMessage;
  
    if (pokePick == 'Put Away'){    //put away pokemon
    game.setAffiliation('', context.playerId);
    game.deleteObject(mapId, context.playerId + "Pokemon");
    }
    else {
    game.setAffiliation(pokePick, context.playerId);   //set pokemon
    }
   });

  game.subscribeToEvent("playerMoves", (data, context) =>{    //watch for movements
    if(context.player.affiliation != ''){     //only try and set pokmon if player has selected one
        movePokemon(context); //makes that pokemon follow you!
    }
  });

  //despawn pokemon on leave, goodbye friend :c
  game.subscribeToEvent("playerExits", (data, context) =>{
    console.log(context);
    game.deleteObject(mapId, context.playerId + "Pokemon");
  });

}

setUp();  //comment out after first run
pokemon();

