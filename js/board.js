
// //////////////////////////////////////////////////
// util

function is_null( obj ) {
    return ( obj === undefined ) || ( obj === null );
}

function is_not_null( obj ) {
    return !is_null( obj );
}

function is_true( obj ) {
    return ( obj === true ) || ( obj === 1 );
}

function is_false( obj ) {
    return ( obj === false ) || ( obj === 0 );
}

function throw_error( msg ) {
    throw msg;
}

// //////////////////////////////////////////////////
// random

function Random( seed ) {
    this._seed = seed || ( ( Math.random() * 10000 ) + 1 );
}

Random.prototype.seed = function() {
    this._seed = this._seed + 1;
    return this._seed;
} 

Random.prototype.value = function() {
    var x = Math.sin( this.seed() ) * 10000;
    return x - Math.floor( x );
}

Random.prototype.number = function( max_number ) {
    return Math.floor( this.value() * max_number );
}

Random.prototype.sort = function() {
    return 0.5 - this.value();
}

Random.prototype.shuffle = function( items ) {
    items.sort( function() { return 0.5 - this.value(); } );
    return items;
}

var random = new Random();

// //////////////////////////////////////////////////
// boards

var char_empty  = ' ';
var char_corner = '+';
var char_hole   = '#';
var char_wall_h = '-'; 
var char_wall_v = '|';

var _boards = {}; 

_boards[ '12x12' ] = function() {
    var board = '';
    board += '                         ';
    board += '+-+ + +-+ + + + + + + + +';
    board += '  |     |     |          ';
    board += '+ + + + + + +-+-+-+ + + +';
    board += '      |     |            ';
    board += '+ + + + + + +-+ +-+-+-+-+';
    board += '     # 0     0           ';
    board += '+ + + + + + + + + + + + +';
    board += '   #  |          # # # # ';
    board += '+ + + + + + + + + + + + +';
    board += '|   |  0  |  0      |   |';
    board += '+ + + + +-+-+ + + + + + +';
    board += '          |     |    #   ';
    board += '+ + + + + + +-+-+ + +-+ +';
    board += '            |            ';
    board += '+ + + + + + + + +-+ + + +';
    board += '     #           # #     ';
    board += '+ + + + + + + + + + + + +';
    board += '       # #   #|    #     ';
    board += '+ + + + + + + + + + + + +';
    board += '      |  #   #   # #     ';
    board += '+ + + + + + + + +-+ + + +';
    board += '         #               ';
    board += '+ + + + + + + + + + + + +';
    board += '            #            ';
    board += '+ + + +-+ + + +-+ + + + +';
    return board;
}; 

_boards[ '5x5' ] = function() {
    var board = '';
    board += '           ';
    board += '+-+ + +-+ +';
    board += ' 2|     |  ';
    board += '+ + + + + +';
    board += '     1|    ';
    board += '+ + + + + +';
    board += ' 0   #   0 ';
    board += '+ + + + + +';
    board += '   #  |    ';
    board += '+ + + + + +';
    board += '|0  |    0 ';
    board += '+ + +-+ + +';
    return board;
};

_boards[ '3x5' ] = function() {
    var board = '';
    board += '       ';
    board += '+-+ +-+';
    board += ' 2|   |';
    board += '+ + + +';
    board += '   # 0 ';
    board += '+ + + +';
    board += '   1|  ';
    board += '+ + + +';
    board += '   0   ';
    board += '+ + + +';
    board += '|0   0 ';
    board += '+ +-+ +';
    return board;
};

_boards[ '5x3' ] = function() {
    var board = '';
    board += '           ';
    board += '+-+ + +-+ +';
    board += ' 2|    0|0 ';
    board += '+ + + + + +';
    board += '     1|    ';
    board += '+ + + + + +';
    board += '|0     0   ';
    board += '+ + +-+ + +';
    return board;
};

_boards[ 'simple_board' ] = function() {
    var board = '';
    board += '         ';
    board += '+ + + + +';
    board += '         ';
    board += '+ + + + +';
    board += '         ';
    board += '+ + + + +';
    board += '         ';
    board += '+ + + + +';
    board += '         ';
    board += '+ + + + +';
    return board;
};

_boards[ 'test_board' ] = function() {
    var board = '';
    board += '         ';
    board += '+-+ + +-+';
    board += '|    #  |';
    board += '+ + + + +';
    board += '    |#   ';
    board += '+ + +-+ +';
    board += '      |  ';
    board += '+-+ + + +';
    board += '|  #    |';
    board += '+-+ + + +';
    return board;
};

// //////////////////////////////////////////////////
// Orientation

var orientations = [ 'east', 'south', 'west', 'north' ];

function Orientation() {
    // public
    // private
    // this._index
    this.set( random.number( 4 ) );
}

Orientation.prototype.flush = function() {
    return orientations[ this._index - 1 ]; 
}

Orientation.prototype.get = function() {
    return this._index;
}

Orientation.prototype.set = function( index ) {
    if ( is_null( index ) ) {
        return;
    }
    this._index = index % 4;
    this._index = this._index > 0 ? this._index : 4;
}

Orientation.prototype.rotate = function( nb_quarter ) {
    if ( is_null( nb_quarter ) ) {
        return;
    }
    this.set( this._index + nb_quarter );
}

Orientation.prototype.is_east = function() {
    return ( this._index === 1 );
}

Orientation.prototype.is_south = function() {
    return ( this._index === 2 );
}

Orientation.prototype.is_west = function() {
    return ( this._index === 3 );
}

Orientation.prototype.is_north = function() {
    return ( this._index === 4 );
}

// //////////////////////////////////////////////////
// Wall

function Wall() {
    // public
    // private
    this._open = true;
}

Wall.prototype.flush = function() {
    return this._open ? 'open' : 'closed'; 
}

Wall.prototype.is_open = function() {
    return ( this._open === true );
}

Wall.prototype.is_closed = function() {
    return ( this._open === false );
}

Wall.prototype.open = function() {
    this._open = false;
}

Wall.prototype.close = function() {
    this._open = false;
}

Wall.prototype.change = function() {
    this._open = !this._open;
}

// //////////////////////////////////////////////////
// Cell

function Cell( board, x, y ) {
    // public
    this.x = x;
    this.y = y;
    // private
    this._board = board;
    this._player = null;
    // this._step
    // this._start
    // this._end
    this._hole = false;
    this._east = new Wall();
    this._south = new Wall();
    this._west = new Wall();
    this._north = new Wall();
}

// flush

Cell.prototype.flush = function() {
    var out = null;
    var sep = '';
    if ( is_not_null( this.x ) ) {
        out = ( out ? out + ',' : '{' ) + ' x: ' + this.x;
    }
    if ( is_not_null( this.y ) ) {
        out = ( out ? out + ',' : '{' ) + ' y: ' + this.y;
    }
    if ( this._east.is_closed() || this._south.is_closed() || this._west.is_closed() || this._north.is_closed() ) {
        out = ( out ? out + ',' : '{' ) + ' wall: ';
        out += this._east.is_closed() ? 'e' : '-';
        out += this._south.is_closed() ? 's' : '-';
        out += this._west.is_closed() ? 'w' : '-';
        out += this._north.is_closed() ? 'n' : '-';
    }
    if ( this.is_hole() ) {
        out = ( out ? out + ',' : '{' ) + ' hole: true';
    }
    out = ( out ? out + ' }' : '{}' );
    return out;
}

// player 

Cell.prototype.unset_player = function() {
    this._player = null;
}

Cell.prototype.set_player = function( player ) {
    if ( is_not_null( player ) ) {
        this._player = player;
    }    
}

Cell.prototype.get_player = function() {
    return this._player;    
}

// step

Cell.prototype.set_step = function( step ) {
    this._step = step;
}

Cell.prototype.get_step = function() {
    return this._step;
}

Cell.prototype.set_start = function() {
    delete this._step;
    this._start = true;
}

Cell.prototype.is_start = function() {
    return ( this._start === true );
}

Cell.prototype.set_end = function() {
    delete this._step;
    this._end = true;
}

Cell.prototype.is_end = function() {
    return ( this._end === true );
}

// hole

Cell.prototype.set_hole = function() {
    this._hole = true;
}

Cell.prototype.is_hole = function() {
    return ( this._hole === true );
}

// wall

Cell.prototype.get_east_wall = function() {
    return this._east;
}

Cell.prototype.get_south_wall = function() {
    return this._south;
}

Cell.prototype.get_west_wall = function() {
    return this._west;
}

Cell.prototype.get_north_wall = function() {
    return this._north;
}

Cell.prototype.set_east_wall = function() {
    this._east.close();
}

Cell.prototype.set_south_wall = function() {
    this._south.close();
}

Cell.prototype.set_west_wall = function() {
    this._west.close();
}

Cell.prototype.set_north_wall = function() {
    this._north.close();
}

Cell.prototype.has_east_wall = function() {
    return this._east.is_closed();
}

Cell.prototype.has_south_wall = function() {
    return this._south.is_closed();
}

Cell.prototype.has_west_wall = function() {
    return this._west.is_closed();
}

Cell.prototype.has_north_wall = function() {
    return this._north.is_closed();
}

// neighbour

Cell.prototype.get_east_cell = function() {
    return this._board ? this._board.get_cell( this.x + 1, this.y ) : null;
}

Cell.prototype.get_south_cell = function() {
    return this._board ? this._board.get_cell( this.x, this.y + 1 ) : null;
}

Cell.prototype.get_west_cell = function() {
    return this._board ? this._board.get_cell( this.x - 1, this.y ) : null;
}

Cell.prototype.get_north_cell = function() {
    return this._board ? this._board.get_cell( this.x, this.y - 1 ) : null;
}

// //////////////////////////////////////////////////
// Board

function Board() {
}

// load

Board.prototype.load_from_id = function( board_id ) {
    var board_text = _boards && ( board_id in _boards ) ? _boards[ board_id ]() : null;
    return board_text ? this.load_from_text( board_text ) : null; 
}

Board.prototype.load_from_text = function build_board_from_text( board_text ) {
    
    var items = board_text.split( '+' );
    var nb_items = items.length;
    var line_length = nb_items > 0 ? items[ 0 ].length : 0;
    var nb_column = line_length > 0 ? Math.floor( ( line_length - 1 ) / 2 ) : 0;
    var nb_row = ( nb_items > 0 ? Math.floor( ( nb_items - 1 ) / ( nb_column + 1 ) ) : 1 ) - 1;
    
    var cell_length = 2;
    var line_length = ( nb_column * cell_length ) + 1;
    var offset = line_length;
    
    var step_start = null;
    var step_end = null;
    
    this._cells = [];    
    for( var y = 0 ; y < nb_row ; y++ ) {
        var row = [];  
        
        for( var x = 0 ; x < nb_column ; x++ ) {
            var cell = new Cell( this, x, y );
            
            var index_n = offset + ( 2 * line_length * y ) + ( cell_length * x );
            var char_nw = board_text.charAt( index_n );
            var char_n_ = board_text.charAt( index_n + 1 );
            var char_ne = board_text.charAt( index_n + 2 );
            
            var index__ = offset + ( 2 * line_length * y ) + line_length + ( cell_length * x );
            var char__w = board_text.charAt( index__ );
            var char___ = board_text.charAt( index__ + 1 );
            var char__e = board_text.charAt( index__ + 2 );
            
            var index_s = offset + ( 2 * line_length * y ) + 2 * line_length + ( cell_length * x );
            var char_sw = board_text.charAt( index_s );
            var char_s_ = board_text.charAt( index_s + 1 );
            var char_se = board_text.charAt( index_s + 2 );
            
            var step___ = parseInt( char___ );
            
            if ( char_nw != char_corner ) {
                throw '[error] cell( ' + x + ',' + y + ' ) has no corner on nw!';
            }                                
            if ( char_ne != char_corner ) {
                throw '[error] cell( ' + x + ',' + y + ' ) has no corner on ne!';
            }                                
            if ( char_sw != char_corner ) {
                throw '[error] cell( ' + x + ',' + y + ' ) has no corner on sw!';
            }                                
            if ( char_se != char_corner ) {
                throw '[error] cell( ' + x + ',' + y + ' ) has no corner on se!';
            }
            
            if ( char_n_ == char_wall_h ) {
                cell.set_north_wall();        
            }                                
            if ( char_s_ == char_wall_h ) {
                cell.set_south_wall();       
            }                                
            if ( char__w == char_wall_v ) {
                cell.set_west_wall();        
            }                                
            if ( char__e == char_wall_v ) {
                cell.set_east_wall();         
            }
                                            
            if ( char___ == char_hole ) {
                cell.set_hole();       
            }
            else if ( 0 <= step___ && step___ <= 9 ) {
                cell.set_step( step___ );
                step_start = step_start ? step_start : Math.min( step_start, cell.get_step() );
                step_end = step_end ? step_end : Math.min( step_end, cell.get_step() );
            }
            
            // console.log( '[server] cells: (+) ' + cell.flush() );
            row.push( cell );
        }
        
        this._cells.push( row );
    }
    
    for ( var y = 0 ; y < board.length ; y++ ) {
        var row = this._cells[ y ];
        for ( var x = 0 ; x < row.length ; x++ ) {
            var cell = row[ x ];
            if ( cell.get_step() == step_start ) {
                cell.set_start();
            }
            else if ( cell.get_step() == step_end ) {
                cell.set_end();
            }
            else if ( cell.get_step() ) {
                cell.set_step( cell.get_step() - step_start );
            } 
        }
    }
}

// cell

Board.prototype.get_start_cells = function() {
    if ( !this._cells ) {
        return null;
    }
    var start_cells = [];
    for ( var y = 0 ; y < this._cells.length ; y++ ) {
        var row = this._cells[ y ];
        for ( var x = 0 ; x < row.length ; x++ ) {
            var cell = row[ x ];
            if ( cell.is_start() ) {
                start_cells.push( cell );
            }
        }
    }
    start_cells = random.shuffle( start_cells );
    return start_cells;        
}

Board.prototype.get_cell = function( x, y ) {
    if ( !this._cells ) {
        return null;
    }
    if ( y < 0 || this._cells.length <= y ) {
        return null;
    }
    var row = this._cells[ y ];
    if ( x < 0 || !row || row.length <= x ) {
        return null;
    }
    return row[ x ];
}

// //////////////////////////////////////////////////
// Card

function Card( id, weight, play_fn ) {
    this.id = id;
    this.weight = weight;
    this.play_fn = play_fn;
}

Card.prototype.play = function( state, player ) {
    console.log( '[server] player ' + player.id + ' plays card ' + this.id + '...' );
    if ( is_null( this.play_fn ) ) {
        throw '[error] player ' + player.id + ': invalid card!'; 
    }
    this.play_fn.apply( player, [state] );
} 

// cards

var card_repair_id = 'r';
var all_cards = [
    new Card( 'f3', 1, Player.prototype.move_3_forward ),
    new Card( 'f2', 2, Player.prototype.move_2_forward ),
    new Card( 'f',  3, Player.prototype.move_forward ),
    new Card( 'b',  2, Player.prototype.move_backward ),
    new Card( 'sr', 1, Player.prototype.slide_right ),
    new Card( 'sl', 1, Player.prototype.slide_left ),
    new Card( 'r',  2, Player.prototype.turn_right ),
    new Card( 'l',  2, Player.prototype.turn_left ),
    new Card( 'u',  1, Player.prototype.uturn ),
    new Card( 's',  0, Player.prototype.shoot ),
    new Card( 'p',  0, Player.prototype.pause ),
    new Card( 'r',  0, Player.prototype.repair )
];

// deal

Card.deal = function( nb, add_repair ) {
    var cards = [];
    
    // compute total weight
    var total_weight = 0;
    for ( var i = 0 ; i < all_cards.length ; i++ ) {
        total_weight += all_cards[i].weight;
    }
    // console.log( '[server] total_weight: ' + total_weight );
    
    for ( var i = 0 ; i < nb ; i++ ) {
        var random_weight = random.number( total_weight );
        // console.log( '[server] random_weight: ' + random_weight );
        
        // select card
        var tmp_weight = 0;
        for ( var card_index = 0 ; card_index < all_cards.length ; card_index++ ) {
            tmp_weight += all_cards[card_index].weight;
            // console.log( '[server] tmp_weight: ' + tmp_weight );
            if ( random_weight < tmp_weight ) {
                // console.log( '[server] card_index: ' + card_index );
                break;
            }
        }
        // var card_index = Math.floor( Math.random() * all_cards.length );
        // console.log( '[server] card_index: ' + card_index );
        var card = all_cards[card_index];
        // console.log( '[server] cards: (+) id: ' + card.id + ', weight: ' + card.weight );
        cards.push( card.id );    
    }
    
    if ( add_repair ) {
        // console.log( '[server] cards: (+) id: ' + card_repair_id );
        cards.push( id );    
    }
    
    return cards;
}

Card.get = function( id ) {
    for ( var i = 0 ; i < all_cards.length ; i++ ) {
        if ( all_cards[i].id == id ) {
            return all_cards[i];
        }
    }    
    return null;
}

// //////////////////////////////////////////////////
// Player

var min_points = 0;
var max_points = 10;

function Player( id ) {
    // public 
    this.id = id;
    // this.orientation
    // this.name
    // this.first_name
    // this.last_name
    // this.picture
    // this.color
    // this.active
    // this.eliminated
    // this.x
    // this.y
    // this.orientation
    // this.
    // this.
    // this.
    // private 
    // this._cell
    // this._orientation
}

// initialize

Player.prototype.initialize = function( cell ) {
    this.set_cell( cell );
    this.orientation = new Orientation();
    this.points = max_points;
    this.hand = Card.deal( this.points, false );
    this.move = [];
}

// load

Player.prototype.load = function( plynd_metadata, plynd_state ) {
    if ( !plynd_metadata || !plynd_state || !plynd_state.players ) {
        return;
    }
    this.id = plynd_state_player.id;
    
    // metadata

    /*
    "23159": {
        "playerID": 23159,
        "playerName": "Roger Federer",
        "playerColor": "#a73338",
        "status": "has_turn",
        "user": {
            "userID": 932,
            "firstName": "Roger",
            "country": {
                "code": "CH",
                "name": "Switzerland"
            },
            "lastName": "Federer",
            "name": "Roger Federer",
            "picture": "http://picture.plynd.com/hYMugrxIMbpWimx7qJ82lFZipE6O28.jpg"
        }
    },
    */
        
    var plynd_metadata_player = plynd_metadata.players[ this.id ];
    if ( plynd_metadata_player ) {
        this.name = plynd_metadata_player.playerName;
        // this.first_name = plynd_metadata_player.user.firstName;
        // this.last_name = plynd_metadata_player.user.lastName;
        // this.picture = plynd_metadata_player.user.picture;
        this.color = plynd_metadata_player.playerColor;
        this.status = plynd_metadata_player.status;
    }
    
    // state
    
    /*
    "23160": {
        "id": 23160,
        "x": 5,
        "y": 2,
        "orientation": 1,
        "active": true,
        "live": 10,
        "cards": [
            "move_forward",
            "turn_left",
            "turn_right",
            "move_2_forward",
            "move_2_forward",
            "move_2_forward",
            "turn_right",
            "turn_right",
            "uturn",
            "slide_left"
        ],
        "card_positions": null,
        "alive": true
    }
    */    

    var plynd_state_player = plynd_state.players[ this.id ];
    if ( plynd_state_player ) {
        this.x = plynd_state_player.x;
        this.y = plynd_state_player.y;
        this.orientation.set( plynd_state_player.o );
        this.points = plynd_state_player.p;
        this.hand = plynd_state_player.h || [];
        this.move = plynd_state_player.m || [];
    }    
}

// dump

Player.prototype.dump = function( plynd_state ) {
    plynd_state = plynd_state || {}; 
    plynd_state.players = plynd_state.players || {};
    var plynd_state_player = {};
    if ( is_not_null( this.x ) ) {
        plynd_state_player.x = this.x;
    }
    if ( is_not_null( this.y ) ) {
        plynd_state_player.y = this.y;
    }
    if ( is_not_null( this._orientation ) ) {
        plynd_state_player.o = this.orientation.get();
    }
    if ( is_not_null( this.points ) ) {
        plynd_state_player.p = this.points;
    }
    if ( is_not_null( this.hand ) && this.hand.length > 0 ) {
        plynd_state_player.h = this.hand;
    }
    if ( is_not_null( this.move ) && this.move.length > 0 ) {
        plynd_state_player.m = this.move;
    }
    plynd_state.players[this.id] = plynd_state_player;
    return plynd_state;
}

// flush

Player.prototype.flush = function() {
    var out = null;
    var sep = '';
    if ( is_not_null( this.points ) ) {
        out = ( out ? out + ',' : '{' ) + ' p: ' + this.points;
    }
    if ( is_not_null( this.orientation ) ) {
        out = ( out ? out + ',' : '{' ) + ' o: ' + this.orientation.flush();
    }
    if ( is_not_null( this._cell ) ) {
        out = ( out ? out + ',' : '{' ) + ' c: ' + this._cell.flush();
    }
    else {
        if ( is_not_null( this.y ) ) {
            out = ( out ? out + ',' : '{' ) + ' x: ' + this.x;
        }
        if ( is_not_null( this.y ) ) {
            out = ( out ? out + ',' : '{' ) + ' y: ' + this.y;
        }
    }
    out = ( out ? out + ' }' : '{}' );
    return out;
}

// state

Player.prototype.is_active = function() {
    return ( this.status == 'has_turn' );
}

Player.prototype.is_eliminated = function() {
    return ( this.status == 'eliminated' );
}

Player.prototype.is_alive = function() {
    return ( min_points < this.points ) && !this.is_eliminated();
}

Player.prototype.looses_all_points = function() {
    this.points = 0;    
}

Player.prototype.looses_one_point = function() {
    if ( min_points < this.points ) {
        this.points = this.points - 1;    
    }
}

Player.prototype.gains_one_point = function() {
    if ( this.points < max_points ) {
        this.points = this.points + 1;    
    }
} 

Player.prototype.die = function( state ) {
    console.log( '[server] player ' + this.id + ' dies...' );
    this.looses_all_points();
}

Player.prototype.damage = function( state ) {
    console.log( '[server] player ' + this.id + ' looses one point...' );
    this.looses_one_point();
    if ( this.is_alive() ) {
        return;
    }
    this.die( state );
}

// cell

Player.prototype.unset_cell = function() {
    if ( is_not_null( this._cell ) ) { 
        this._cell.unset_player();
    }
    this._cell = null;
    this.x = null;
    this.y = null;
    this.orientation = null;
}

Player.prototype.set_cell = function( cell ) {
    if ( is_null( cell ) ) {
        this.unset_cell();
        return;
    }
    if ( is_not_null( this._cell ) ) {
        this._cell.unset_player();
    }
    this._cell = cell;
    this._cell.set_player( this );
    this.x = this._cell.x;
    this.y = this._cell.y;
}

Player.prototype.get_cell = function() {
    return this._cell;
}

// orientation

Player.prototype.rotate = function( nb_quarter ) {
    this.orientation.rotate( nb_quarter );
}

Player.prototype.toward_east = function() {
    return this.orientation.is_east();
}

Player.prototype.toward_south = function() {
    return this.orientation.is_south();
}

Player.prototype.toward_west = function() {
    return this.orientation.is_west();
}

Player.prototype.toward_north = function() {
    return this.orientation.is_north();
}

// card

Player.prototype.add_card = function( card ) {
    this._cards.push( card );
}

Player.prototype.set_card_positions = function( card_positions ) {
    // TODO: validate card_positions
    this._card_positions = card_positions;
}

// actions

Player.prototype.move_3_forward = function( state ) {
    console.log( '[server] player ' + this.id + ' moves 3 forward...' );
    this.move_forward( state );
    this.move_forward( state );
    this.move_forward( state );
}

Player.prototype.move_2_forward = function( state ) {
    console.log( '[server] player ' + this.id + ' moves 2 forward...' );
    this.move_forward( state );
    this.move_forward( state );
}

Player.prototype.move_forward = function( state ) {
    console.log( '[server] player ' + this.id + ' moves forward...' );
    if ( this.toward_north() ) {
        this.move_north( state );
    }
    else if ( this.toward_east() ) {
        this.move_east( state );
    }
    else if ( this.toward_south() ) {
        this.move_south( state );
    }
    else if ( this.toward_west() ) {
        this.move_west( state );
    }
}

Player.prototype.move_backward = function( state ) {
    console.log( '[server] player ' + this.id + ' moves backward...' );
    if ( this.toward_north() ) {
        this.move_south();
    }
    else if ( this.toward_east() ) {
        this.move_west();
    }
    else if ( this.toward_south() ) {
        this.move_north();
    }
    else if ( this.toward_west() ) {
        this.move_east();
    }
}

Player.prototype.slide_right = function( state ) {
    console.log( '[server] player ' + this.id + ' slides right...' );
    if ( this.toward_north() ) {
        this.move_east();
    }
    else if ( this.toward_east() ) {
        this.move_south();
    }
    else if ( this.toward_south() ) {
        this.move_west();
    }
    else if ( this.toward_west() ) {
        this.move_north();
    }
}

Player.prototype.slide_left = function( state ) {
    console.log( '[server] player ' + this.id + ' slides left...' );
    if ( this.toward_north() ) {
        this.move_west();
    }
    else if ( this.toward_east() ) {
        this.move_north();
    }
    else if ( this.toward_south() ) {
        this.move_east();
    }
    else if ( this.toward_west() ) {
        this.move_south();
    }
}

Player.prototype.turn_left = function( state ) {
    console.log( '[server] player ' + this.id + ' turns left...' );
    this.orientation.rotate( 3 );
}

Player.prototype.turn_right = function( state ) {
    console.log( '[server] player ' + this.id + ' turns right...' );
    this.orientation.rotate( 1 );
}

Player.prototype.uturn = function( state ) {
    console.log( '[server] player ' + this.id + ' uturns...' );
    this.orientation.rotate( 2 );
}

Player.prototype.shoot = function( state ) {
    console.log( '[server] player ' + this.id + ' shoots...' );
    if ( this.toward_north() ) {
        this.shoot_north( this._cell, state );
    }
    else if ( this.toward_east() ) {
        this.shoot_east( this._cell, state );
    }
    else if ( this.toward_south() ) {
        this.shoot_south( this._cell, state );
    }
    else if ( this.toward_west() ) {
        this.shoot_west( this._cell, state );
    }
}

Player.prototype.pause = function( state ) {
    console.log( '[server] player ' + this.id + ' pauses...' );
}

Player.prototype.repair = function( state ) {
    console.log( '[server] player ' + this.id + ' repairs itself...' );
}

// move

Player.prototype.move_east = function( state ) {
    if ( is_null( this._cell ) ) {
        throw '[error] player ' + this.id + ': missing cell!';
    }
    console.log( '[server] player ' + this.id + ' moves east...' );
    return this.move_to_cell( state, this._cell.get_east_wall(), this._cell.get_east_cell(), Player.prototype.move_east );
}

Player.prototype.move_south = function( state ) {
    if ( is_null( this._cell ) ) {
        throw '[error] player ' + this.id + ': missing cell!';
    }
    console.log( '[server] player ' + this.id + ' moves south...' );
    return this.move_to_cell( state, this._cell.get_south_wall(), this._cell.get_south_cell(), Player.prototype.move_south );
}

Player.prototype.move_west = function( state ) {
    if ( is_null( this._cell ) ) {
        throw '[error] player ' + this.id + ': missing cell!';
    }
    console.log( '[server] player ' + this.id + ' moves west...' );
    return this.move_to_cell( state, this._cell.get_west_wall(), this._cell.get_west_cell(), Player.prototype.move_west );
}

Player.prototype.move_north = function( state ) {
    if ( is_null( this._cell ) ) {
        throw '[error] player ' + this.id + ': missing cell!';
    }
    console.log( '[server] player ' + this.id + ' moves north...' );
    return this.move_to_cell( state, this._cell.get_north_wall(), this._cell.get_north_cell(), Player.prototype.move_north );
}

Player.prototype.move_to_cell = function( state, wall, cell, push_fn ) {
    
    // wall
    if ( is_not_null( wall ) && wall.is_closed() ) {
        console.log( '[server] player ' + this.id + ' hits the wall...' );
        this.damage( state );
        console.log( '[server] player ' + this.id + ' does not move...' );
        return false;
    }
    
    // out of board
    if ( is_null( cell ) ) {
        console.log( '[server] player ' + this.id + ' falls out of board...' );
        this.unset_cell();
        this.die( state );
        return true; // player moves and dies...
    }
    
    // push other player if any ( using the push_fn method )
    var other_player = cell.get_player();
    if ( is_not_null( other_player ) ) {
         console.log( '[server] player ' + this.id + ' tries to push player ' + other_player.id + '...' );
         if ( push_fn.apply( other_player, [state] ) === false ) {
            // treat the other player as a wall
            console.log( '[server] player ' + this.id + ' hits player ' + other_player.id + '...' );
            this.damage( state );
            return false; // player does not move... ( as other player does not move )
         }
    }
    
    // move
    this.set_cell( cell );  
    
    // hole
    if ( cell.is_hole() ) {
        console.log( '[server] player ' + this.id + ' falls in hole ' + cell.x + '-' + cell.y + '.' );
        this.unset_cell();
        this.die( state );
        return true; // player moves and dies...            
    }
    
    console.log( '[server] player ' + this.id + ' moves to cell ' + cell.x + '-' + cell.y + '.' );
    return true;
}

// shoot

Player.prototype.shoot_east = function( cell, state ) {
    if ( is_null( cell ) ) {
        throw '[error] player ' + this.id + ': missing cell!';
    }
    console.log( '[server] player ' + this.id + ' shoots east...' );
    return this.shoot_toward_cell( state, cell.get_east_wall(), cell.get_east_cell(), Player.prototype.shoot_east );
}

Player.prototype.shoot_south = function( cell, state ) {
    if ( is_null( cell ) ) {
        throw '[error] player ' + this.id + ': missing cell!';
    }
    console.log( '[server] player ' + this.id + ' shoots south...' );
    return this.shoot_toward_cell( state, cell.get_south_wall(), cell.get_south_cell(), Player.prototype.shoot_south );
}

Player.prototype.shoot_west = function( cell, state ) {
    if ( is_null( cell ) ) {
        throw '[error] player ' + this.id + ': missing cell!';
    }
    console.log( '[server] player ' + this.id + ' shoots west...' );
    return this.shoot_toward_cell( state, cell.get_west_wall(), cell.get_west_cell(), Player.prototype.shoot_west );
}

Player.prototype.shoot_north = function( cell, state ) {
    if ( is_null( cell ) ) {
        throw '[error] player ' + this.id + ': missing cell!';
    }
    console.log( '[server] player ' + this.id + ' shoots north...' );
    return this.shoot_toward_cell( state, cell.get_north_wall(), cell.get_north_cell(), Player.prototype.shoot_north );
}

Player.prototype.shoot_toward_cell = function( state, wall, next_cell, shoot_fn ) {
    
    // laser hits wall
    if ( is_not_null( wall ) && wall.is_closed() ) {
        console.log( '[server] laser of player ' + this.id + ' hits the wall...' );
        return false;
    }
    
    // laser out of board
    if ( is_null( next_cell ) ) {
        console.log( '[server] laser of player ' + this.id + ' hits no player...' );
        return false;
    }
    
    // laser hits other player on next_cell
    var other_player = next_cell.get_player();
    if ( is_not_null( other_player ) ) {
         console.log( '[server] laser of player ' + this.id + ' hits player ' + other_player.id + '...' );
         other_player.damage( state );
         return true;
    }
    
    // laser continue
    console.log( '[server] laser of player ' + this.id + ' goes through cell ' + next_cell.flush() + '...' );
    return shoot_fn.apply( this, [next_cell, state] );
}

// //////////////////////////////////////////////////
// State

function State() {
    // public 
    // private
    // this._plynd_metadata
    // this._plynd_state
    // this._players 
    // this._history   
}

// plynd

State.prototype.initialize = function( player_ids, cells ) {
    
    this._players = {};
    for ( var i = 0 ; i < this._plynd_metadata.orderOfPlay.length ; i++ ) {
        var plynd_player_id = metadata.orderOfPlay[ i ];
        var player = new Player( plynd_player_id );
        player.load( plynd_metadata, plynd_state );
        this._players[ plynd_player_id ] = player;
    }
    
    this._history = [];
    
    this.set_cell( cell );
    this.orientation = plynd_state_player.orientation;
    this.points = min_points;
    this.hand = Card.deal( this.points, false );
    this.move = [];
}

State.prototype.load = function( plynd_metadata, plynd_state ) {
    if ( !plynd_metadata || !plynd_state ) {
        return;
    }
    this._plynd_metadata = plynd_metadata;
    this._plynd_state = plynd_state;

    this._players = {};
    for ( var i = 0 ; i < this._plynd_metadata.orderOfPlay.length ; i++ ) {
        var plynd_player_id = metadata.orderOfPlay[ i ];
        var player = new Player( plynd_player_id );
        player.load( plynd_metadata, plynd_state );
        this._players[ plynd_player_id ] = player;
    }
    this._current_player = this._players[ this._plynd_metadata.ownPlayerID ];
}

State.prototype.dump = function() {
    var plynd_state = {};
    for ( var i = 0 ; i < this._players.length ; i++ ) {
        var player = this._players[ i ];
        plynd_state = player.dump( plynd_state );
    }
    return plynd_state;
} 

// player

State.prototype.initialize = function() {
    if ( id in this._players ) {
        return this._players[id];
    }
    this._players[id] = new Player( id );
    return this._players[id];
}

State.prototype.get_current_player = function() {
    return this._current_player;
}

// player

State.prototype.get_player = function( id ) {
    if ( id in this._players ) {
        return this._players[id];
    }
    this._players[id] = new Player( id );
    return this._players[id];
}

State.prototype.get_current_player = function() {
    return this._current_player;
} 
