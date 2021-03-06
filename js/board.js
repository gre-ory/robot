
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

var secure_stringify_cache = [];
function secure_stringify( key, value ) {
    if ( typeof value === 'object' && value !== null ) {
        if ( key.indexOf('_ref') !== -1 ) {
            // do not print reference to parent
            return;
        }
        if ( secure_stringify_cache.indexOf(value) !== -1 ) {
            // Circular reference found, disprogram key
            return;
        }
        // Store value in our collection
        secure_stringify_cache.push(value);
    }
    return value;
}

function debug( name, value ) {
    if ( is_not_null( value ) ) {
        console.log( '[debug] ' + name + ': ' + JSON.stringify( value, secure_stringify, 2 ) );
    }
    else {
        console.log( '[debug] ' + JSON.stringify( name, secure_stringify, 2 ) );
    }
    secure_stringify_cache = [];
}

function info( name, value ) {
    if ( is_not_null( value ) ) {
        console.log( '[info] ' + name + ': ' + JSON.stringify( value, null, 2 ) );
    }
    else {
        console.log( '[info] ' + JSON.stringify( name, null, 2 ) );
    }
    secure_stringify_cache = [];
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
    var current_random = this;
    items.sort( function() { return 0.5 - current_random.value(); } );
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

var char_conveyor_belt_n = 'A';
var char_conveyor_belt_e = '>';
var char_conveyor_belt_s = 'V';
var char_conveyor_belt_w = '<';

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
    board += '   #  |> > > > > # # # # ';
    board += '+ + + + + + + + + + + + +';
    board += '|   |  0  |  0      |   |';
    board += '+ + + + +-+-+ + + + + + +';
    board += '   > > v  |     |    #   ';
    board += '+ + + + + + +-+-+ + +-+ +';
    board += '   A   v    |            ';
    board += '+ + + + + + + + +-+ + + +';
    board += '   A # v         # #     ';
    board += '+ + + + + + + + + + + + +';
    board += '   A < < #   #|    #     ';
    board += '+ + + + + + + + + + + + +';
    board += '      |  #   #   # #     ';
    board += '+ + + + + + + + +-+ + + +';
    board += '         # < < < <       ';
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
    board += '|0   # 0|';
    board += '+ + + + +';
    board += '    |#   ';
    board += '+ + +-+ +';
    board += '     0|  ';
    board += '+-+ + + +';
    board += '|  #    |';
    board += '+-+ + + +';
    return board;
};

_boards[ 'test_conveyor_belts' ] = function() {
    var board = '';
    board += '         ';
    board += '+ + + + +';
    board += ' > V A   ';
    board += '+ + + + +';
    board += '   V A < ';
    board += '+ + + + +';
    board += '   V < A ';
    board += '+ + + + +';
    board += '   > A   ';
    board += '+ + + + +';
    board += '         ';
    board += '+ + + + +';
    board += '   V <   ';
    board += '+ + + + +';
    board += '   > A   ';
    board += '+ + + + +';
    return board;
};

// load helper

function load_board_from_id( board_id ) {
    var board_text = _boards && ( board_id in _boards ) ? _boards[ board_id ]() : null;
    var board = board_text ? load_board_from_text( board_text ) : null;
    return board; 
}

function load_board_from_text( board_text ) {
    
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
    
    var board = new Board();
    board._cells = [];
    for( var y = 0 ; y < nb_row ; y++ ) {
        var row = [];  
        
        for( var x = 0 ; x < nb_column ; x++ ) {
            var cell = new Cell( board, x, y );
            
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
            else if ( char___ == char_conveyor_belt_e ) {
                cell.set_conveyor_belt_direction( 'e' );
            }
            else if ( char___ == char_conveyor_belt_s ) {
                cell.set_conveyor_belt_direction( 's' );
            }
            else if ( char___ == char_conveyor_belt_w ) {
                cell.set_conveyor_belt_direction( 'w' );
            }
            else if ( char___ == char_conveyor_belt_n ) {
                cell.set_conveyor_belt_direction( 'n' );
            }
            else if ( 0 <= step___ && step___ <= 9 ) {
                cell.set_step( step___ );
                step_start = step_start ? step_start : Math.min( step_start, cell.get_step() );
                step_end = step_end ? step_end : Math.min( step_end, cell.get_step() );
            }
            
            // console.log( '[server] cells: (+) ' + cell.flush() );
            row.push( cell );
        }
        
        board._cells.push( row );
    }

    if ( is_null( step_start ) ) {
        step_start = 0;    
    }
    if ( is_null( step_end ) ) {
        step_end = step_start;    
    }
    
    for ( var y = 0 ; y < board._cells.length ; y++ ) {
        var row = board._cells[ y ];
        for ( var x = 0 ; x < row.length ; x++ ) {
            var cell = row[ x ];

            // conveyor belt

            if ( cell.has_conveyor_belt() ) {
                var conveyor_belt = cell.get_conveyor_belt();

                // check that neighbour is not coming in the opposite direction
                // set incoming conveyor belts
                // check that two conveyor belts are not pointing to the same cell

                {
                    var neighbour = cell.get_east_cell();
                    if ( is_not_null( neighbour ) ) {
                        if ( neighbour.has_conveyor_belt_toward_west() ) {
                            if ( conveyor_belt.toward_east() ) {
                                throw '[error] conflicting conveyor belt!'
                            }
                            conveyor_belt.set_incoming_from_east();
                        }
                    }
                }
                {
                    var neighbour = cell.get_south_cell();
                    if ( is_not_null( neighbour ) ) {
                        //debug( 'neighbour', neighbour );
                        if ( neighbour.has_conveyor_belt_toward_north() ) {
                            if ( conveyor_belt.toward_south() ) {
                                throw '[error] conflicting conveyor belt!'
                            }
                            conveyor_belt.set_incoming_from_south();
                        }
                    }
                }
                {
                    var neighbour = cell.get_west_cell();
                    if ( is_not_null( neighbour ) ) {
                        //debug( 'neighbour', neighbour );
                        if ( neighbour.has_conveyor_belt_toward_east() ) {
                            if ( conveyor_belt.toward_west() ) {
                                throw '[error] conflicting conveyor belt!'
                            }
                            conveyor_belt.set_incoming_from_west();
                        }
                    }
                }
                {
                    var neighbour = cell.get_north_cell();
                    if ( is_not_null( neighbour ) ) {
                        //debug( 'neighbour', neighbour );
                        if ( neighbour.has_conveyor_belt_toward_south() ) {
                            if ( conveyor_belt.toward_north() ) {
                                throw '[error] conflicting conveyor belt!'
                            }
                            conveyor_belt.set_incoming_from_north();
                        }
                    }
                }
            }

            // step

            if ( cell.has_step() ) {
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
    return board;
}

// //////////////////////////////////////////////////
// Orientation

var orientation_chars = [ 'e', 's', 'w', 'n' ];
var orientation_names = [ 'east', 'south', 'west', 'north' ];

function Orientation() {
    // public
    // private
    // this._index
}

Orientation.prototype.initialize = function( orientation_char ) {
    if ( is_not_null( orientation_char ) ) {
        this.set_char( orientation_char );
    }
    if ( is_null( this._index ) ) {
        this.set( random.number( 4 ) );
    }
}

Orientation.prototype.get_char = function() {
    if ( is_null( this._index ) ) {
        return '';
    }
    return orientation_chars[ this._index ];
}

Orientation.prototype.set_char = function( orientation_char ) {
    for ( var i = 0 ; i < 4 ; ++i ) {
        if ( orientation_chars[ i ] === orientation_char ) {
            return this.set( i );
        }
    }
    return this.unset();
}

Orientation.prototype.set = function( index ) {
    if ( is_null( index ) ) {
        return;
    }
    this._index = index % 4;
}

Orientation.prototype.flush = function() {
    if ( is_null( this._index ) ) {
        return '';
    }
    return orientation_names[ this._index ];
}

Orientation.prototype.is_set = function() {
    return is_not_null( this._index );
}

Orientation.prototype.unset = function() {
    this._index = null;
}

Orientation.prototype.rotate = function( nb_quarter ) {
    if ( is_null( nb_quarter ) ) {
        return;
    }
    this.set( this._index + nb_quarter );
}

Orientation.prototype.is_east = function() {
    return ( this._index === 0 );
}

Orientation.prototype.is_south = function() {
    return ( this._index === 1 );
}

Orientation.prototype.is_west = function() {
    return ( this._index === 2 );
}

Orientation.prototype.is_north = function() {
    return ( this._index === 3 );
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
// ConveyorBelt

function ConveyorBelt( orientation_char ) {
    // public
    // private
    this._orientation = new Orientation();
    this._orientation.set_char( orientation_char );
    // this._incoming_directions
}

ConveyorBelt.prototype.toward_east = function() {
    return this._orientation.is_east();
}

ConveyorBelt.prototype.toward_south = function() {
    return this._orientation.is_south();
}

ConveyorBelt.prototype.toward_west = function() {
    return this._orientation.is_west();
}

ConveyorBelt.prototype.toward_north = function() {
    return this._orientation.is_north();
}

ConveyorBelt.prototype.set_incoming_direction = function( orientation_char ) {
    if ( is_null( this._incoming_directions ) ) {
        this._incoming_directions = [];
    }
    if ( orientation_char in this._incoming_directions ) {
        return;
    }
    this._incoming_directions.push( orientation_char );
}

ConveyorBelt.prototype.set_incoming_from_east = function() {
    this.set_incoming_direction( 'e' );
}

ConveyorBelt.prototype.set_incoming_from_south = function() {
    this.set_incoming_direction( 's' );
}

ConveyorBelt.prototype.set_incoming_from_west = function() {
    this.set_incoming_direction( 'w' );
}

ConveyorBelt.prototype.set_incoming_from_north = function() {
    this.set_incoming_direction( 'n' );
}

ConveyorBelt.prototype.has_incoming_from_east = function() {
    return 'e' in this._incoming_directions;
}

ConveyorBelt.prototype.has_incoming_from_south = function() {
    return 's' in this._incoming_directions;
}

ConveyorBelt.prototype.has_incoming_from_west = function() {
    return 'w' in this._incoming_directions;
}

ConveyorBelt.prototype.has_incoming_from_north = function() {
    return 'n' in this._incoming_directions;
}

/*
ConveyorBelt.prototype.activate = function( player ) {
    if ( is_null( player ) ) {
        throw '[error] missing player!';
    }
    var cell = player.get_cell();
    if ( is_null( cell ) ) {
        throw '[error] missing cell!';
    }
    if ( this.toward_east() ) {
    }
    else if ( this.toward_south() ) {
    }
    else if ( this.toward_west() ) {
    }
    else if ( this.toward_north() ) {
    }
}
*/

// //////////////////////////////////////////////////
// Cell

function Cell( board, x, y ) {
    // public
    this.x = x;
    this.y = y;
    // private
    this._board_ref = board;
    this._robot = null;
    // this._step
    // this._start
    // this._end
    this._hole = false;
    this._east = new Wall();
    this._south = new Wall();
    this._west = new Wall();
    this._north = new Wall();
    // this._conveyor_belt
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

// robot 

Cell.prototype.unset_robot = function() {
    this._robot = null;
}

Cell.prototype.set_robot = function( robot ) {
    if ( is_not_null( robot ) ) {
        this._robot = robot;
    }    
}

Cell.prototype.get_robot = function() {
    return this._robot;    
}

// step

Cell.prototype.set_step = function( step ) {
    this._step = step;
}

Cell.prototype.has_step = function() {
    return is_not_null( this._step );
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

// conveyor belt

Cell.prototype.has_conveyor_belt = function() {
    return is_not_null( this._conveyor_belt );
}

Cell.prototype.get_conveyor_belt = function() {
    return this._conveyor_belt;
}

Cell.prototype.set_conveyor_belt_direction = function( direction_char ) {
    if ( is_not_null( this._conveyor_belt ) ) {
        throw '[error] conveyor belt already set!';
    }
    this._conveyor_belt = new ConveyorBelt( direction_char );
}

Cell.prototype.has_conveyor_belt_toward_east = function() {
    return is_not_null( this._conveyor_belt ) && this._conveyor_belt.toward_east();
}

Cell.prototype.has_conveyor_belt_toward_south = function() {
    return is_not_null( this._conveyor_belt ) && this._conveyor_belt.toward_south();
}

Cell.prototype.has_conveyor_belt_toward_west = function() {
    return is_not_null( this._conveyor_belt ) && this._conveyor_belt.toward_west();
}

Cell.prototype.has_conveyor_belt_toward_north = function() {
    return is_not_null( this._conveyor_belt ) && this._conveyor_belt.toward_north();
}

Cell.prototype.has_conveyor_belt_coming_from_east = function() {
    var neighbour = this.get_east_cell();
    return is_not_null( neighbour ) && neighbour.has_conveyor_belt_toward_west();
}

Cell.prototype.has_conveyor_belt_coming_from_south = function() {
    var neighbour = this.get_south_cell();
    return is_not_null( neighbour ) && neighbour.has_conveyor_belt_toward_north();
}

Cell.prototype.has_conveyor_belt_coming_from_west = function() {
    var neighbour = this.get_west_cell();
    return is_not_null( neighbour ) && neighbour.has_conveyor_belt_toward_east();
}

Cell.prototype.has_conveyor_belt_coming_from_north = function() {
    var neighbour = this.get_north_cell();
    return is_not_null( neighbour ) && neighbour.has_conveyor_belt_toward_south();
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
    return this._board_ref ? this._board_ref.get_cell( this.x + 1, this.y ) : null;
}

Cell.prototype.get_south_cell = function() {
    return this._board_ref ? this._board_ref.get_cell( this.x, this.y + 1 ) : null;
}

Cell.prototype.get_west_cell = function() {
    return this._board_ref ? this._board_ref.get_cell( this.x - 1, this.y ) : null;
}

Cell.prototype.get_north_cell = function() {
    return this._board_ref ? this._board_ref.get_cell( this.x, this.y - 1 ) : null;
}

// //////////////////////////////////////////////////
// Board

function Board() {
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
// Robot

var min_points = 0;
var max_points = 10;
var nb_phase = 5;

function Robot( id ) {
    // public 
    this.id = id;
    this.orientation = new Orientation();
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
    // this._registers
}

// initialize

Robot.prototype.initialize = function( cell, orientation_char ) {
    this.set_cell( cell );
    this.orientation.initialize( orientation_char );
    this.points = max_points;
    this._programs = Program.select( this.points, false );
    this._registers = [];
}

// _prepare ( called from State.prototype._prepare )

Robot.prototype._prepare = function( plynd_player_metadata, plynd_robot_state, board ) {
    
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

    if ( plynd_player_metadata ) {
        this.name = plynd_player_metadata.playerName;
        // this.first_name = plynd_player_metadata.user.firstName;
        // this.last_name = plynd_player_metadata.user.lastName;
        // this.picture = plynd_player_metadata.user.picture;
        this.color = plynd_player_metadata.playerColor;
        this.status = plynd_player_metadata.status;
    }
    
    // state
    
    /*
    "23160": {
        "id": 23160,
        "x": 5,
        "y": 2,
        "o": 1,
        "p": 10,
        "h": [ ... ],
        "m": [ ... ]
    }
    */    
    
    if ( plynd_robot_state ) {
        var cell = is_not_null( board ) ? board.get_cell( plynd_robot_state.x, plynd_robot_state.y ) : null;
        if ( is_null( cell ) ) {
            throw '[error] invalid robot position! (' + plynd_robot_state.x + ',' + plynd_robot_state.y + ')';
        }
        this.set_cell( cell );
        this.orientation.set_char( plynd_robot_state.o );
        this.points = plynd_robot_state.p;
        this._programs = plynd_robot_state.programs || [];
        this._registers = plynd_robot_state.registers || [];
    }    
}

// dump

Robot.prototype.dump = function() {
    var plynd_state = {}; 
    if ( is_not_null( this.id ) ) {
        plynd_state.id = this.id;
    }
    if ( is_not_null( this.x ) ) {
        plynd_state.x = this.x;
    }
    if ( is_not_null( this.y ) ) {
        plynd_state.y = this.y;
    }
    if ( this.orientation.is_set() ) {
        plynd_state.o = this.orientation.get_char();
    }
    if ( is_not_null( this.points ) ) {
        plynd_state.p = this.points;
    }
    if ( is_not_null( this._programs ) && this._programs.length > 0 ) {
        plynd_state.programs = this._programs;
    }
    if ( is_not_null( this._registers ) && this._registers.length > 0 ) {
        plynd_state.registers = this._registers;
    }
    return plynd_state;
}

// flush

Robot.prototype.flush = function() {
    var out = null;
    var sep = '';
    var out = '{ id: ' + this.id;
    if ( is_not_null( this.points ) ) {
        out += ', p: ' + this.points;
    }
    if ( this.orientation.is_set() ) {
        out += ', o: ' + this.orientation.get_char();
    }
    if ( is_not_null( this._cell ) ) {
        out += ', c: ' + this._cell.flush();
    }
    else {
        if ( is_not_null( this.y ) ) {
            out += ', x: ' + this.x;
        }
        if ( is_not_null( this.y ) ) {
            out += ', y: ' + this.y;
        }
    }
    out += ' }';
    return out;
}

// state

Robot.prototype.is_active = function() {
    return ( this.status == 'has_turn' );
}

Robot.prototype.is_eliminated = function() {
    return ( this.status == 'eliminated' );
}

Robot.prototype.is_alive = function() {
    return ( min_points < this.points ) && !this.is_eliminated();
}

Robot.prototype.looses_all_points = function() {
    console.log( '[server] robot ' + this.id + ' looses all points...' );
    this.points = min_points;
}

Robot.prototype.looses_points = function( points ) {
    console.log( '[server] robot ' + this.id + ' looses ' + points + ' point(s)...' );
    this.points = Math.max( min_points, Math.min( max_points, this.points - points ) );
}

Robot.prototype.gains_points = function( points ) {
    console.log( '[server] robot ' + this.id + ' gains ' + points + ' point(s)...' );
    this.points = Math.max( min_points, Math.min( max_points, this.points + points ) );
}

Robot.prototype.die = function( state ) {
    console.log( '[server] robot ' + this.id + ' dies...' );
    this.unset_cell();
    this.unset_orientation();
    this.looses_all_points();
}

Robot.prototype.damage = function( state, damage ) {
    this.looses_points( damage );
    if ( this.is_alive() ) {
        return;
    }
    this.die( state );
}

// cell

Robot.prototype.unset_cell = function() {
    if ( is_not_null( this._cell ) ) { 
        this._cell.unset_robot();
    }
    this._cell = null;
    this.x = null;
    this.y = null;
}

Robot.prototype.set_cell = function( cell ) {
    if ( is_null( cell ) ) {
        this.unset_cell();
        return;
    }
    if ( is_not_null( this._cell ) ) {
        this._cell.unset_robot();
    }
    this._cell = cell;
    this._cell.set_robot( this );
    this.x = this._cell.x;
    this.y = this._cell.y;
}

Robot.prototype.get_cell = function() {
    return this._cell;
}

Robot.prototype.activate_conveyor_belt = function( state ) {
    if ( is_null( this._cell ) ) {
        throw '[error] missing cell!';
    }
    if ( !this._cell.has_conveyor_belt() ) {
        return true;
    }
    else if ( this._cell.has_conveyor_belt_toward_east() ) {
        console.log( '[server] conveyor belt under robot ' + this.id + ' moves toward east...' );
        if ( !this.move_east( state, /* by_conveyor_belt */ true ) ) {
            return false;
        }
        else if ( is_null( this._cell ) ) {
            return true; // robot died
        }
        else if ( this._cell.has_conveyor_belt_toward_south() ) {
            this.turn_right( state );
        }
        else if ( this._cell.has_conveyor_belt_toward_north() ) {
            this.turn_left( state );
        }
    }
    else if ( this._cell.has_conveyor_belt_toward_south() ) {
        console.log( '[server] conveyor belt under robot ' + this.id + ' moves toward south...' );
        if ( !this.move_south( state, /* by_conveyor_belt */ true ) ) {
            return false;
        }
        else if ( is_null( this._cell ) ) {
            return true; // robot died
        }
        else if ( this._cell.has_conveyor_belt_toward_east() ) {
            this.turn_left( state );
        }
        else if ( this._cell.has_conveyor_belt_toward_west() ) {
            this.turn_right( state );
        }
    }
    else if ( this._cell.has_conveyor_belt_toward_west() ) {
        console.log( '[server] conveyor belt under robot ' + this.id + ' moves toward west...' );
        if ( !this.move_west( state, /* by_conveyor_belt */ true ) ) {
            return false;
        }
        else if ( is_null( this._cell ) ) {
            return true; // robot died
        }
        else if ( this._cell.has_conveyor_belt_toward_south() ) {
            this.turn_left( state );
        }
        else if ( this._cell.has_conveyor_belt_toward_north() ) {
            this.turn_right( state );
        }
    }
    else if ( this._cell.has_conveyor_belt_toward_north() ) {
        console.log( '[server] conveyor belt under robot ' + this.id + ' moves toward north...' );
        if ( !this.move_north( state, /* by_conveyor_belt */ true ) ) {
            return false;
        }
        else if ( is_null( this._cell ) ) {
            return true; // robot died
        }
        else if ( this._cell.has_conveyor_belt_toward_east() ) {
            this.turn_right( state );
        }
        else if ( this._cell.has_conveyor_belt_toward_west() ) {
            this.turn_left( state );
        }
    }
}

// orientation

Robot.prototype.unset_orientation = function() {
    this.orientation.unset();
}

Robot.prototype.rotate = function( nb_quarter ) {
    this.orientation.rotate( nb_quarter );
}

Robot.prototype.toward_east = function() {
    return this.orientation.is_east();
}

Robot.prototype.toward_south = function() {
    return this.orientation.is_south();
}

Robot.prototype.toward_west = function() {
    return this.orientation.is_west();
}

Robot.prototype.toward_north = function() {
    return this.orientation.is_north();
}

// programs

Robot.prototype.get_programs = function() {
    return this._programs;
}

// registers
//  - it is an index pointing to one program / program

Robot.prototype.has_played = function() {
    return this.has_registers();
}

Robot.prototype.has_registers = function() {
    return is_not_null( this._registers ) && ( this._registers.length != 0 );
}

Robot.prototype.get_registers = function() {
    return this._registers;
}

Robot.prototype.select_registers = function( registers ) {
    if ( is_null( registers ) ) {
        throw '[error] robot ' + this.id + ': missing registers!';
    } 
    if ( registers.length > nb_phase ) {
        throw '[error] robot ' + this.id + ': too much registers!';
    } 
    if ( registers.length < nb_phase ) {
        throw '[error] robot ' + this.id + ': not enough registers!';
    }
    console.log( '[server] robot ' + this.id + ': select_registers: ' + registers.join( '-' ) )
    var registers_already_selected = [];
    for ( var phase = 0 ; phase < nb_phase; ++phase ) {
        var register = parseInt( registers[ phase ] );
        if ( ( 0 <= register ) && ( register < this._programs.length ) ) {
            if ( registers_already_selected.indexOf( register ) !== -1 ) {
                throw '[error] robot ' + this.id + ': register ' + register + ' already selected!';
            }
            registers_already_selected.push( register );
        }
        else {
            throw '[error] robot ' + this.id + ': invalid register: ' + registers[ phase ] + '!';
        }
    } 
    this._registers = registers;
}

Robot.prototype.activate_register = function( state, phase ) {
    if ( ( 0 <= phase ) && ( phase < this._registers.length ) ) {
        var register = this._registers[ phase ];
        if ( ( 0 <= register ) && ( register < this._programs.length ) ) {
            var program_id = this._programs[ register ];
            console.log( '[server] activate: { phase: ' + phase + ', robot: ' + this.id + ', register: ' + register + ', program: ' + program_id + ' }' );
            var program = Program.get( program_id );
            program.activate( state, this );
        }
        else {
            throw '[error] robot ' + this.id + ': invalid register! (' + register + ')';
        }
    }
    else {
        throw '[error] robot ' + this.id + ': invalid phase! (' + phase + ')';
    }
}

// actions

Robot.prototype.move_3_forward = function( state ) {
    console.log( '[server] robot ' + this.id + ' moves 3 forward...' );
    this.move_forward( state );
    this.move_forward( state );
    this.move_forward( state );
}

Robot.prototype.move_2_forward = function( state ) {
    console.log( '[server] robot ' + this.id + ' moves 2 forward...' );
    this.move_forward( state );
    this.move_forward( state );
}

Robot.prototype.move_forward = function( state ) {
    console.log( '[server] robot ' + this.id + ' moves forward...' );
    if ( this.toward_north() ) {
        this.move_north( state, /* by_conveyor_belt */ false );
    }
    else if ( this.toward_east() ) {
        this.move_east( state, /* by_conveyor_belt */ false );
    }
    else if ( this.toward_south() ) {
        this.move_south( state, /* by_conveyor_belt */ false );
    }
    else if ( this.toward_west() ) {
        this.move_west( state, /* by_conveyor_belt */ false );
    }
}

Robot.prototype.move_backward = function( state ) {
    console.log( '[server] robot ' + this.id + ' moves backward...' );
    if ( this.toward_north() ) {
        this.move_south( state, /* by_conveyor_belt */ false );
    }
    else if ( this.toward_east() ) {
        this.move_west( state, /* by_conveyor_belt */ false );
    }
    else if ( this.toward_south() ) {
        this.move_north( state, /* by_conveyor_belt */ false );
    }
    else if ( this.toward_west() ) {
        this.move_east( state, /* by_conveyor_belt */ false );
    }
}

Robot.prototype.slide_right = function( state ) {
    console.log( '[server] robot ' + this.id + ' slides right...' );
    if ( this.toward_north() ) {
        this.move_east( state, /* by_conveyor_belt */ false );
    }
    else if ( this.toward_east() ) {
        this.move_south( state, /* by_conveyor_belt */ false );
    }
    else if ( this.toward_south() ) {
        this.move_west( state, /* by_conveyor_belt */ false );
    }
    else if ( this.toward_west() ) {
        this.move_north( state, /* by_conveyor_belt */ false );
    }
}

Robot.prototype.slide_left = function( state ) {
    console.log( '[server] robot ' + this.id + ' slides left...' );
    if ( this.toward_north() ) {
        this.move_west( state, /* by_conveyor_belt */ false );
    }
    else if ( this.toward_east() ) {
        this.move_north( state, /* by_conveyor_belt */ false );
    }
    else if ( this.toward_south() ) {
        this.move_east( state, /* by_conveyor_belt */ false );
    }
    else if ( this.toward_west() ) {
        this.move_south( state, /* by_conveyor_belt */ false );
    }
}

Robot.prototype.turn_left = function( state ) {
    console.log( '[server] robot ' + this.id + ' turns left...' );
    this.orientation.rotate( 3 );
}

Robot.prototype.turn_right = function( state ) {
    console.log( '[server] robot ' + this.id + ' turns right...' );
    this.orientation.rotate( 1 );
}

Robot.prototype.uturn = function( state ) {
    console.log( '[server] robot ' + this.id + ' uturns...' );
    this.orientation.rotate( 2 );
}

Robot.prototype.shoot = function( state ) {
    console.log( '[server] robot ' + this.id + ' shoots...' );
    if ( this.toward_north() ) {
        this.shoot_north( this._cell, 1, state );
    }
    else if ( this.toward_east() ) {
        this.shoot_east( this._cell, 1, state );
    }
    else if ( this.toward_south() ) {
        this.shoot_south( this._cell, 1, state );
    }
    else if ( this.toward_west() ) {
        this.shoot_west( this._cell, 1, state );
    }
}

Robot.prototype.shoot_2 = function( state ) {
    console.log( '[server] robot ' + this.id + ' shoots twice...' );
    if ( this.toward_north() ) {
        this.shoot_north( this._cell, 2, state );
    }
    else if ( this.toward_east() ) {
        this.shoot_east( this._cell, 2, state );
    }
    else if ( this.toward_south() ) {
        this.shoot_south( this._cell, 2, state );
    }
    else if ( this.toward_west() ) {
        this.shoot_west( this._cell, 2, state );
    }
}

Robot.prototype.pause = function( state ) {
    console.log( '[server] robot ' + this.id + ' pauses...' );
}

Robot.prototype.repair = function( state ) {
    console.log( '[server] robot ' + this.id + ' repairs itself...' );
}

// move

Robot.prototype.move_east = function( state, by_conveyor_belt ) {
    if ( is_null( this._cell ) ) {
        throw '[error] robot ' + this.id + ': missing cell!';
    }
    console.log( '[server] robot ' + this.id + ' moves east...' );
    return this.move_to_cell( state, by_conveyor_belt, this._cell.get_east_wall(), this._cell.get_east_cell(), Robot.prototype.move_east );
}

Robot.prototype.move_south = function( state, by_conveyor_belt ) {
    if ( is_null( this._cell ) ) {
        throw '[error] robot ' + this.id + ': missing cell!';
    }
    console.log( '[server] robot ' + this.id + ' moves south...' );
    return this.move_to_cell( state, by_conveyor_belt, this._cell.get_south_wall(), this._cell.get_south_cell(), Robot.prototype.move_south );
}

Robot.prototype.move_west = function( state, by_conveyor_belt ) {
    if ( is_null( this._cell ) ) {
        throw '[error] robot ' + this.id + ': missing cell!';
    }
    console.log( '[server] robot ' + this.id + ' moves west...' );
    return this.move_to_cell( state, by_conveyor_belt, this._cell.get_west_wall(), this._cell.get_west_cell(), Robot.prototype.move_west );
}

Robot.prototype.move_north = function( state, by_conveyor_belt ) {
    if ( is_null( this._cell ) ) {
        throw '[error] robot ' + this.id + ': missing cell!';
    }
    console.log( '[server] robot ' + this.id + ' moves north...' );
    return this.move_to_cell( state, by_conveyor_belt, this._cell.get_north_wall(), this._cell.get_north_cell(), Robot.prototype.move_north );
}

Robot.prototype.move_to_cell = function( state, by_conveyor_belt, wall, cell, push_fn ) {
    
    // wall
    if ( is_not_null( wall ) && wall.is_closed() ) {
        console.log( '[server] robot ' + this.id + ' hits the wall...' );
        this.damage( state, 1 );
        console.log( '[server] robot ' + this.id + ' does not move...' );
        return false;
    }
    
    // out of board
    if ( is_null( cell ) ) {
        console.log( '[server] robot ' + this.id + ' falls out of board...' );
        this.die( state );
        return true; // robot moves and dies...
    }
    
    // push other robot if any ( using the push_fn method )
    var other_robot = cell.get_robot();
    if ( is_not_null( other_robot ) ) {
        if ( by_conveyor_belt ) {
            console.log( '[server] robot ' + this.id + ' could not be pushed by conveyor belt as target cell is occupied by robot ' + other_robot.id + '...' );
            return false;
        }
        console.log( '[server] robot ' + this.id + ' tries to push robot ' + other_robot.id + '...' );
        if ( push_fn.apply( other_robot, [state, by_conveyor_belt] ) === false ) {
            // treat the other robot as a wall
            console.log( '[server] robot ' + this.id + ' hits robot ' + other_robot.id + '...' );
            this.damage( state, 1 );
            return false; // robot does not move... ( as other robot does not move )
        }
    }
    
    // move
    this.set_cell( cell );

    // hole
    if ( cell.is_hole() ) {
        console.log( '[server] robot ' + this.id + ' falls in hole ' + cell.x + '-' + cell.y + '.' );
        this.die( state );
        return true; // robot moves and dies...            
    }
    
    console.log( '[server] robot ' + this.id + ' moves to cell ' + cell.x + '-' + cell.y + '.' );
    return true;
}

// shoot

Robot.prototype.shoot_east = function( cell, damage, state ) {
    if ( is_null( cell ) ) {
        throw '[error] robot ' + this.id + ': missing cell!';
    }
    console.log( '[server] robot ' + this.id + ' shoots east...' );
    return this.shoot_toward_cell( state, damage, cell.get_east_wall(), cell.get_east_cell(), Robot.prototype.shoot_east );
}

Robot.prototype.shoot_south = function( cell, damage, state ) {
    if ( is_null( cell ) ) {
        throw '[error] robot ' + this.id + ': missing cell!';
    }
    console.log( '[server] robot ' + this.id + ' shoots south...' );
    return this.shoot_toward_cell( state, damage, cell.get_south_wall(), cell.get_south_cell(), Robot.prototype.shoot_south );
}

Robot.prototype.shoot_west = function( cell, damage, state ) {
    if ( is_null( cell ) ) {
        throw '[error] robot ' + this.id + ': missing cell!';
    }
    console.log( '[server] robot ' + this.id + ' shoots west...' );
    return this.shoot_toward_cell( state, damage, cell.get_west_wall(), cell.get_west_cell(), Robot.prototype.shoot_west );
}

Robot.prototype.shoot_north = function( cell, damage, state ) {
    if ( is_null( cell ) ) {
        throw '[error] robot ' + this.id + ': missing cell!';
    }
    console.log( '[server] robot ' + this.id + ' shoots north...' );
    return this.shoot_toward_cell( state, damage, cell.get_north_wall(), cell.get_north_cell(), Robot.prototype.shoot_north );
}

Robot.prototype.shoot_toward_cell = function( state, damage, wall, next_cell, shoot_fn ) {
    
    // laser hits wall
    if ( is_not_null( wall ) && wall.is_closed() ) {
        console.log( '[server] laser of robot ' + this.id + ' hits the wall...' );
        return false;
    }
    
    // laser out of board
    if ( is_null( next_cell ) ) {
        console.log( '[server] laser of robot ' + this.id + ' hits no robot...' );
        return false;
    }
    
    // laser hits other robot on next_cell
    var other_robot = next_cell.get_robot();
    if ( is_not_null( other_robot ) ) {
         console.log( '[server] laser of robot ' + this.id + ' hits robot ' + other_robot.id + '...' );
         other_robot.damage( state, damage );
         return true;
    }
    
    // laser continue
    console.log( '[server] laser of robot ' + this.id + ' goes through cell ' + next_cell.flush() + '...' );
    return shoot_fn.apply( this, [next_cell, damage, state] );
}

// //////////////////////////////////////////////////
// Program

function Program( id, weight, program_fn ) {
    this.id = id;
    this.weight = weight;
    this.program_fn = program_fn;
}

Program.prototype.activate = function( state, robot ) {
    console.log( '[server] robot ' + robot.id + ' activates program ' + this.id + '...' );
    if ( is_null( this.program_fn ) ) {
        throw '[error] robot ' + robot.id + ': invalid program!';
    }
    this.program_fn.apply( robot, [state] );
}

// programs

var program_repair_id = 'r';
var all_programs = [
    new Program( '3',  6, Robot.prototype.move_3_forward ),
    new Program( '2', 12, Robot.prototype.move_2_forward ),
    new Program( '1', 18, Robot.prototype.move_forward ),
    new Program( 'b',  6, Robot.prototype.move_backward ),
    new Program( 'r', 18, Robot.prototype.turn_right ),
    new Program( 'l', 18, Robot.prototype.turn_left ),
    new Program( 'u',  6, Robot.prototype.uturn ),
    new Program( 'R',  6, Robot.prototype.slide_right ),
    new Program( 'L',  6, Robot.prototype.slide_left ),
    new Program( 's', 12, Robot.prototype.shoot ),
    new Program( 'S',  6, Robot.prototype.shoot_2 ),
    new Program( 'r', 12, Robot.prototype.repair )
];

// select

Program.select = function( nb, add_repair ) {
    var programs = [];

    // compute total weight
    var total_weight = 0;
    for ( var i = 0 ; i < all_programs.length ; i++ ) {
        total_weight += all_programs[i].weight;
    }
    // console.log( '[server] total_weight: ' + total_weight );

    for ( var i = 0 ; i < nb ; i++ ) {
        var random_weight = random.number( total_weight );
        // console.log( '[server] random_weight: ' + random_weight );

        // select program
        var tmp_weight = 0;
        for ( var program_index = 0 ; program_index < all_programs.length ; program_index++ ) {
            tmp_weight += all_programs[program_index].weight;
            // console.log( '[server] tmp_weight: ' + tmp_weight );
            if ( random_weight < tmp_weight ) {
                // console.log( '[server] program_index: ' + program_index );
                break;
            }
        }
        // var program_index = Math.floor( Math.random() * all_programs.length );
        // console.log( '[server] program_index: ' + program_index );
        var program = all_programs[program_index];
        // console.log( '[server] programs: (+) id: ' + program.id + ', weight: ' + program.weight );
        programs.push( program.id );
    }

    /*
    if ( add_repair ) {
        // console.log( '[server] programs: (+) id: ' + program_repair_id );
        programs.push( id );
    }
    */

    return programs;
}

Program.get = function( id ) {
    for ( var i = 0 ; i < all_programs.length ; i++ ) {
        if ( all_programs[i].id == id ) {
            return all_programs[i];
        }
    }
    throw '[error] invalid program id! (' + id + ')';
}

// //////////////////////////////////////////////////
// State

function State( plynd_metadata, plynd_state ) {
    // public 
    // private
    this._plynd_metadata = plynd_metadata;
    this._plynd_state = plynd_state;
    // this._robots
    // this._current_robot
    // this._board
    // this._history
    
    // prepare
    this._prepare();
}

// plynd

State.prototype._prepare = function() {
    if ( is_null( this._plynd_metadata ) ) {
        return;
    }
    // prepare board
    this._board = load_board_from_id( this._plynd_metadata.boardID );
    // prepare robots
    var plynd_metadata_players = is_not_null( this._plynd_metadata.players ) ? this._plynd_metadata.players : {};
    var plynd_state_robots = is_not_null( this._plynd_state ) && is_not_null( this._plynd_state.robots ) ? this._plynd_state.robots : {};    
    this._robots = {};
    for ( var i = 0 ; i < this._plynd_metadata.orderOfPlay.length ; i++ ) {
        var plynd_robot_id = this._plynd_metadata.orderOfPlay[ i ];
        var robot = new Robot( plynd_robot_id );
        var plynd_player_metadata = robot.id in plynd_metadata_players ? plynd_metadata_players[ robot.id ] : null;
        var plynd_robot_state = robot.id in plynd_state_robots ? plynd_state_robots[ robot.id ] : null;
        robot._prepare( plynd_player_metadata, plynd_robot_state, this._board );
        this._robots[ plynd_robot_id ] = robot;
    }
    this._current_robot_id = this._plynd_metadata.ownPlayerID;
}

State.prototype.initialize = function() {
    var start_cells = is_not_null( this._board ) ? this._board.get_start_cells() : [];
    var index = 0;
    for ( var id in this._robots ) {
        var start_cell = index < start_cells.length ? start_cells[ index ] : null;
        this._robots[ id ].initialize( start_cell );
        index++;
    }
}

State.prototype.dump = function() {
    var plynd_state = {
        robots: {}
    };
    for ( var id in this._robots ) {
        plynd_state.robots[ id ] = this._robots[ id ].dump();
    }
    return plynd_state;
}

State.prototype.flush = function() {
    var out = null;
    for ( var id in this._robots ) {
        out = ( out ? out + ', ' : '[ ' ) + this._robots[id].flush();
    }
    out = ( out ? out + ' ]' : '[]' );
    return out;
}

// board

State.prototype.get_board = function() {
    return this._board;
}

// robot

State.prototype.get_robot = function( id ) {
    if ( id in this._robots ) {
        return this._robots[id];
    }
    this._robots[id] = new Robot( id );
    return this._robots[id];
}

State.prototype.get_current_robot = function() {
    return this.get_robot( this._current_robot_id );
}

// end of turn

State.prototype.could_trigger_end_of_turn = function() {
    for ( var id in this._robots ) {
        var robot =  this._robots[id];
        if ( robot.has_played() !== true ) {
            console.log( '[server] turn: waiting at least for robot ' + id + '.' );
            return false;
        }
    }
    return true;
}

State.prototype.trigger_end_of_turn = function() {

    var robots_ids = Object.keys( this._robots );
    for ( var phase = 0 ; phase < nb_phase; ++phase ) {
        console.log( '[server] turn: --- phase ' + phase + ' --- ' );

        // robots

        robots_ids = random.shuffle( robots_ids );
        for ( var i = 0 ; i < robots_ids.length; ++i ) {
            var robot = this._robots[ robots_ids[ i ] ];
            robot.activate_register( this, phase );
        }

        // conveyor belts

        robots_ids = random.shuffle( robots_ids );
        for ( var i = 0 ; i < robots_ids.length; ++i ) {
            var robot = this._robots[ robots_ids[ i ] ];
            robot.activate_conveyor_belt( this );
        }

    }
}

// //////////////////////////////////////////////////
// plynd

function server_error( err ) {
    debug( 'exception', err );
    if ( typeof err === 'string' ) {
        if ( err.indexOf( '[error]' ) !== -1 ) {
            return { code:403, data: err };
        }
        return { code:403, data: '[error] ' + err + '!' };
    }
    console.log( err.stack );
    return { code:403, data: err };
}

function server_initialize_state( plynd_metadata, plynd_state, request, success_fn, error_fn ) {
    try {
        var state = new State( plynd_metadata, plynd_state );
        state.initialize();
        success_fn( state.dump(), null );
    }
    catch( err ) {
        error_fn( null, server_error( err ) );
    } 
}

function server_retrieve_board( plynd_metadata, plynd_state, request, success_fn, error_fn ) {
    try {
        var state = new State( plynd_metadata, plynd_state );
        var board = state.get_board();
        success_fn( state.dump(), board );
    }
    catch( err ) {
        error_fn( null, server_error( err ) );
    } 
}

function server_select_registers( plynd_metadata, plynd_state, request, success_fn, error_fn ) {
    try {
        var state = new State( plynd_metadata, plynd_state );
        var robot = state.get_current_robot();
        var registers = is_not_null( request ) && is_not_null( request.registers ) ? request.registers : null;
        robot.select_registers( registers );
        if ( state.could_trigger_end_of_turn() ) {
            state.trigger_end_of_turn();
        }
        success_fn( state.dump(), null );
    }
    catch( err ) {
        error_fn( null, server_error( err ) );
    }
}

if ( typeof Plynd !== 'undefined' ) { 

    Plynd.ServerFunctions.initializeState = function( request, success_fn, error_fn ) {
        Plynd.getGame( function( plynd_state, plynd_metadata ) {
            server_initialize_state( plynd_metadata, plynd_state, request,
                // return state
                function( new_plynd_state, response ) {
                    success_fn( new_plynd_state );
                },
                // return error
                function( new_plynd_state, error ) {
                    error_fn( error );
                }
            );
        } );
    }
    
    Plynd.ServerFunctions.retrieve_board = function( request, success_fn, error_fn ) {
        Plynd.getGame( function( plynd_state, plynd_metadata ) {
            server_retrieve_board( plynd_metadata, plynd_state, request,
                // return response
                function( new_plynd_state, response ) {
                    success_fn( response );
                },
                // return error
                function( new_plynd_state, error ) {
                    error_fn( error );
                }
            );
        } );
    }
    
    Plynd.ServerFunctions.select_registers = function( request, success_fn, error_fn ) {
        Plynd.getGame( function( plynd_state, plynd_metadata ) {
            server_select_registers( plynd_metadata, plynd_state, request,
                // update game
                function( new_plynd_state, response ) {
                    Plynd.updateGame( response, new_plynd_state, success_fn, error_fn );
                },
                // return error
                function( new_plynd_state, error ) {
                    error_fn( error );
                }
            );
        } );
    }
    
}

// //////////////////////////////////////////////////
// tasks

// TODO: change program numbers
// TODO: use 1 letter for program and cell
// DONE: implement register activation
// DONE: change 'move' to 'register'
// DONE: change 'hand' to 'programs'
// DONE: change 'program' to 'program'
// DONE: change 'player' to 'robot'
// DONE: orientation: change index to char
// TODO: implement repair action
// TODO: implement conveyor belt class
// TODO: implement error class
// TODO: check ludism for new good rules
