const { API_KEY } = require("./api-key");
const { Game, convertCoordsToBBoxes } = require("@gathertown/gather-game-client");
const { setgroups } = require("process");
global.WebSocket = require("isomorphic-ws");

/**** setup ****/

// what's going on here is better explained in the docs:
// https://gathertown.notion.site/Gather-Websocket-API-bf2d5d4526db412590c3579c36141063
const game = new Game(() => Promise.resolve({ apiKey: API_KEY }));
game.connect("jEDZjhqoI4iAKolF\\OrigamiUSA"); // replace with your spaceId of choice
game.subscribeToConnection((connected) => console.log("connected?", connected));

//images left at index 0, right at 1
//walk left test at 2
let pokeball =
  "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/tY3NKLnSH19EEstnaZ6Ix5";
let Charmander =
  ["https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/jVCkcZ3RL8P82qC13Uc3vL",
  "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/1O95vgKdt55RUaccK747Yr",
  "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/993iEo4Dao7WzeGEvQP7Iu",
  "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/RAn23hyaDeIzpk08B8JCCx"
];
let Squirtle =
  ["https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/ggYDMTlJdsJGyFLA35O5pG", 
  "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/ohkujdHjBLKDcJQP2cWNHj"
];
let Bulbasaur =
  ["https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/d02kXkvXlC2WGgOrjfoO2v",
  "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/jEDZjhqoI4iAKolF/1f9c898TFKMl1fM2QSkN3w"
];

const mapId = "Origami Cafe";

//get new x and y for pokemon based on movement
function getNewPokeLocation(x, y, direction){
  if(direction == 1 || direction ==2 ){     //down
    return [x, y-1, 0];
  }
  if(direction == 3 || direction ==4 ){   //up
    return [x, y+1, 0];
  }
  if(direction == 5 || direction ==6 ){   //left
    return [x+1, y, 0];
  }
  if(direction == 7 || direction ==8 ){    //right
    return [x-1, y, 1];
  }
}

function movePokemon(context){
  //make object
  let objectId = context.playerId +"Pokemon";
  let location = getNewPokeLocation(context.player.x, context.player.y, context.player.direction);
  //console.log(eval(context.player.affiliation));
  let state = 'normal';
  let imageLocation = eval(context.player.affiliation)[location[2]];

  //check if image should alternate
  if(game.getObject(objectId).obj.customState == 'normal' && eval(context.player.affiliation).length >1){   //only some of the images have walking sprites, checking for that
    imageLocation = eval(context.player.affiliation)[location[2]+2];
     state = 'walking'
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
  game.setObject('Origami Cafe', objectId, obj);
  },200);
}

function setUp(){
  let names = ["Charmander", "Squirtle", "Bulbasaur", "Put Away"];     //array with values
  //starting x and y
  let startX = 27;
  let startY = 20;

  //let objectId = "squirtleBall"; 

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

    console.log("setting the object");
    game.setObject(mapId, objectId, obj);
  }

  }, 3000); 
}




function pokemon(){
  //watch for pokemon choosing
  game.subscribeToEvent("playerInteracts", (data, context) => {
    let mapObject = game.getObject(data.playerInteracts.objId).obj; 
    let pokePick = game.getObject(data.playerInteracts.objId).obj.previewMessage;
  
        //put away pokemon
  if (pokePick == 'Put Away'){
    game.setAffiliation('', context.playerId);
    game.deleteObject(mapId, context.playerId + "Pokemon");
  }
  else {
    game.setAffiliation(pokePick, context.playerId);   //set pokemon
  
  }
  
  });

  game.subscribeToEvent("playerMoves", (data, context) =>{    //watch for movements
    if(context.player.affiliation != ''){
     // console.log(game.getObject(context.playerId + "Pokemon"));
      //move object
        movePokemon(context);
    }
  });

  //spawn pokemon on entry
  //despawn pokemon on leave
  game.subscribeToEvent("playerExits", (data, context) =>{
    console.log(context);
    game.deleteObject(mapId, context.playerId + "Pokemon");
  });

}

setUp();
pokemon();

