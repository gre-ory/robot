
// //////////////////////////////////////////////////
// board

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
    board += ' 0|     |              0 ';
    board += '+ + + + + + + + + + + + +';
    board += '     1|                  ';
    board += '+ + + + + + + + + + + + +';
    board += '     #                   ';
    board += '+ + + + + + + + + + + + +';
    board += '   #  |          # # # # ';
    board += '+ + + + + + + + + + + + +';
    board += '|   |     |             |';
    board += '+ + + + +-+-+ + + + + + +';
    board += '          |              ';
    board += '+ + + + + + + + + + + + +';
    board += '            |            ';
    board += '+ + + + + + + + +-+ + + +';
    board += '     #           # #     ';
    board += '+ + + + + + + + + + + + +';
    board += '              |    #     ';
    board += '+ + + + + + + + + + + + +';
    board += '      |          # #     ';
    board += '+ + + + + + + + +-+ + + +';
    board += '                         ';
    board += '+ + + + + + + + + + + + +';
    board += ' 0                     0 ';
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

function build_board_from_text( board_text ) {
    
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
        
    var board = [];
    for( var y = 0 ; y < nb_row ; y++ ) {
        var row = [];  
        
        for( var x = 0 ; x < nb_column ; x++ ) {
            var cell = { x:x, y:y };
            
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
                console.log( '[server] error: cell( ' + x + ',' + y + ' ) has no corner on nw!' );
                return null;
            }                                
            if ( char_ne != char_corner ) {
                console.log( '[server] error: cell( ' + x + ',' + y + ' ) has no corner on ne!' );
                return null;
            }                                
            if ( char_sw != char_corner ) {
                console.log( '[server] error: cell( ' + x + ',' + y + ' ) has no corner on sw!' );
                return null;
            }                                
            if ( char_se != char_corner ) {
                console.log( '[server] error: cell( ' + x + ',' + y + ' ) has no corner on se!' );
                return null;
            }
            
            if ( char_n_ == char_wall_h ) {
                cell.north = true;        
            }                                
            if ( char_s_ == char_wall_h ) {
                cell.south = true;        
            }                                
            if ( char__w == char_wall_v ) {
                cell.west = true;        
            }                                
            if ( char__e == char_wall_v ) {
                cell.east = true;        
            }
                                            
            if ( char___ == char_hole ) {
                cell.hole = true;        
            }
            else if ( 0 <= step___ && step___ <= 9 ) {
                cell.step = step___;
                step_start = step_start ? step_start : Math.min( step_start, cell.step );
                step_end = step_end ? step_end : Math.min( step_end, cell.step );
            }
        
            row.push( cell );
        }
        
        board.push( row );
    }
    
    for ( var y = 0 ; y < board.length ; y++ ) {
        var row = board[ y ];
        for ( var x = 0 ; x < row.length ; x++ ) {
            var cell = row[ x ];
            if ( cell.step == step_start ) {
                cell.start = true;
                delete cell.step;    
            }
            else if ( cell.step == step_end ) {
                cell.end = true;
                delete cell.step;    
            }
            else if ( cell.step ) {
                cell.step = cell.step - step_start;
            } 
        }
    }
    return board;        
}

function fetch_start_cells( board ) {
    var start_cells = [];
    for ( var y = 0 ; y < board.length ; y++ ) {
        var row = board[ y ];
        for ( var x = 0 ; x < row.length ; x++ ) {
            var cell = row[ x ];
            if ( !cell.start ) {
                continue;
            }
            start_cells.push( cell );
        }
    }
    return start_cells;        
}

function get_board( metadata, state ) {
    var board_ids = Object.keys( _boards );
    var board_id = board_ids[ 0 ];
    var board_text = _boards[ board_id ]();
    var board = build_board_from_text( board_text );
    return board;
}

function get_cell( board, x, y ) {
    if ( y < 0 || !board || board.length <= y ) {
        return null;
    }
    var row = board[ y ];
    if ( x < 0 || !row || row.length <= x ) {
        return null;
    }
    return row[ x ];
} 

function player_is_on_cell( player, cell ) {
    return ( player && cell ) ? ( player.x == cell.x ) && ( player.y == cell.y ) : false;    
}

function get_state_player_on_cell( state, cell ) {
    if ( state.players ) {
        for ( var player_id in state.players ) {
            var state_player = state.players[ player_id ];
            if ( player_is_on_cell( state_player, cell ) ) {
                return state_player;
            }
        }
    }
    return null;
}

// //////////////////////////////////////////////////
// card

var max_cards           = 5; 
var card_move_3_forward = 'move_3_forward';
var card_move_2_forward = 'move_2_forward';
var card_move_forward   = 'move_forward';
var card_move_backward  = 'move_backward';
var card_slide_right    = 'slide_right';
var card_slide_left     = 'slide_left';
var card_turn_right     = 'turn_right';
var card_turn_left      = 'turn_left';
var card_uturn          = 'uturn';
var card_pause          = 'pause';
var card_repair         = 'repair';
var all_cards = [ card_move_3_forward, card_move_2_forward, card_move_forward, card_move_backward
                , card_slide_right, card_slide_left
                , card_turn_right, card_turn_left, card_uturn
                , card_pause, card_repair ];

function deal_player_cards( nb ) {
    var cards = [];
    for ( var i = 0 ; i < nb ; i++ ) {
        var card_index = Math.floor( Math.random() * all_cards.length );
        cards.push( all_cards[ card_index ] );    
    }
    return cards;
}

function save_cards( metadata, state, board, player, card_positions ) {
    var state_player = state.players[ metadata.ownPlayerID ];
    // validate number of card
    if ( card_positions.length != max_cards ) {
        throw 'player ' + metadata.ownPlayerID + ' have to play ' + max_cards + ' cards!';
    }
    for ( var i = 0 ; i < card_positions.length ; i++ ) {
        var card_position = card_positions[ i ];
        // validate card position
        if ( ( card_position < 0 ) || ( state_player.cards.length <= card_position ) ) {
            throw 'invalid card position!';
        }
        // validate card 
        var card = state_player.cards[ card_position ];
    }
    state_player.card_positions = card_positions;
    return state;
}

function everyone_has_played( metadata, state ) {
    if ( !state.players ) {
        console.log( '[server] no player.' );
        return false;
    }
    for ( var player_id in state.players ) {
        var state_player = state.players[ player_id ];
        // TODO validate status of player
        if ( !state_player ) {
            console.log( '[server] missing state for player ' + player_id );
            return false;
        }
        if ( !state_player.card_positions ) {
            console.log( '[server] at least waiting for player ' + player_id );
            return false;
        }
    }
    console.log( '[server] all players have played.' );
    return true;
}

function apply_all_cards( metadata, state, board ) {
    if ( !state.players ) {
        return state; // no player    
    }
    for ( var round = 0 ; round < max_cards ; round++ ) {
        var cards_to_play = [];
        for ( var player_id in state.players ) {
            var state_player = state.players[ player_id ];
            // TODO validate status of player
            if ( !state_player ) {
                continue; // no state for player
            }
            if ( !state_player.card_positions ) {
                continue; // no card for player
            }
            if ( state_player.card_positions.length <= round ) {
                continue; // no more card for player
            }
            var card_position = state_player.card_positions[ round ];
            var card = state_player.cards[ card_position ];
            cards_to_play.push( { state_player: state_player, card_position: card_position, card: card } );
        }
        
        if ( cards_to_play.length == 0 ) {
            console.log( '[server] round ' + round + ': no card to play!' );
            break;
        }
        
        // shuffle
        cards_to_play.sort( function() { return 0.5 - Math.random() } );
        
        for ( var i = 0 ; i < cards_to_play.length ; i++ ) {
            var card_to_play = cards_to_play[ i ];
            var state_player = card_to_play.state_player;
            var card_position = card_to_play.card_position;
            var card = card_to_play.card;
            console.log( '[server] round ' + round + ': about to play card #' + card_position + ' ' + card + ' for player ' + state_player.id );
            state = apply_card( metadata, state, board, state_player, card );
        }    
    }
    return state;
}

function apply_cards( metadata, state, board, state_player, card_positions ) {
    for ( var i = 0 ; i < card_positions.length ; i++ ) {
        var card_position = card_positions[ i ];
        var card = state_player.cards[ card_position ];
        state = apply_card( metadata, state, board, state_player, card );
    }
    return state;
}

function apply_card( metadata, state, board, state_player, card ) {
    console.log( '[server] card', card );
    if ( card == card_move_3_forward ) {
        state_player = move_3_forward( metadata, state, board, state_player );
    }
    else if ( card == card_move_2_forward ) {
        state_player = move_2_forward( metadata, state, board, state_player );
    }
    else if ( card == card_move_forward ) {
        state_player = move_forward( metadata, state, board, state_player );
    }
    else if ( card == card_move_backward ) {
        state_player = move_backward( metadata, state, board, state_player );
    }
    else if ( card == card_slide_right ) {
        state_player = slide_right( metadata, state, board, state_player );
    }
    else if ( card == card_slide_left ) {
        state_player = slide_left( metadata, state, board, state_player );
    }
    else if ( card == card_turn_right ) {
        state_player = turn_right( metadata, state, board, state_player );
    }
    else if ( card == card_turn_left ) {
        state_player = turn_left( metadata, state, board, state_player );
    }
    else if ( card == card_uturn ) {
        state_player = uturn( metadata, state, board, state_player );
    }
    else if ( card == card_pause ) {
        state_player = pause( metadata, state, board, state_player );
    }
    else if ( card == card_repair ) {
        state_player = repair( metadata, state, board, state_player );
    }
    state.players[ state_player.id ] = state_player;
    return state;     
}

// //////////////////////////////////////////////////
// actions

function move_3_forward( metadata, state, board, state_player ) {
    console.log( '[server] player ' + state_player.id + ' moves 3 forward...' );
    state_player = move_forward( metadata, state, board, state_player );
    state_player = move_forward( metadata, state, board, state_player );
    state_player = move_forward( metadata, state, board, state_player );
    return state_player;
}

function move_2_forward( metadata, state, board, state_player ) {
    console.log( '[server] player ' + state_player.id + ' moves 2 forward...' );
    state_player = move_forward( metadata, state, board, state_player );
    state_player = move_forward( metadata, state, board, state_player );
    return state_player;
}

function move_forward( metadata, state, board, state_player ) {
    console.log( '[server] player ' + state_player.id + ' moves forward...' );
    if ( state_player.orientation == orientation_north ) {
        state_player = move_north( metadata, state, board, state_player );
    }
    else if ( state_player.orientation == orientation_east ) {
        state_player = move_east( metadata, state, board, state_player );
    }
    else if ( state_player.orientation == orientation_south ) {
        state_player = move_south( metadata, state, board, state_player );
    }
    else if ( state_player.orientation == orientation_west ) {
        state_player = move_west( metadata, state, board, state_player );
    }
    return state_player;
}

function move_backward( metadata, state, board, state_player ) {
    console.log( '[server] player ' + state_player.id + ' moves backward...' );
    if ( state_player.orientation == orientation_north ) {
        state_player = move_south( metadata, state, board, state_player );
    }
    else if ( state_player.orientation == orientation_east ) {
        state_player = move_west( metadata, state, board, state_player );
    }
    else if ( state_player.orientation == orientation_south ) {
        state_player = move_north( metadata, state, board, state_player );
    }
    else if ( state_player.orientation == orientation_west ) {
        state_player = move_east( metadata, state, board, state_player );
    }
    return state_player;    
}

function slide_right( metadata, state, board, state_player ) {
    console.log( '[server] player ' + state_player.id + ' slides right...' );
    if ( state_player.orientation == orientation_north ) {
        state_player = move_east( metadata, state, board, state_player );
    }
    else if ( state_player.orientation == orientation_east ) {
        state_player = move_south( metadata, state, board, state_player );
    }
    else if ( state_player.orientation == orientation_south ) {
        state_player = move_west( metadata, state, board, state_player );
    }
    else if ( state_player.orientation == orientation_west ) {
        state_player = move_north( metadata, state, board, state_player );
    }
    return state_player;    
}

function slide_left( metadata, state, board, state_player ) {
    console.log( '[server] player ' + state_player.id + ' slides left...' );
    if ( state_player.orientation == orientation_north ) {
        state_player = move_west( metadata, state, board, state_player );
    }
    else if ( state_player.orientation == orientation_east ) {
        state_player = move_north( metadata, state, board, state_player );
    }
    else if ( state_player.orientation == orientation_south ) {
        state_player = move_east( metadata, state, board, state_player );
    }
    else if ( state_player.orientation == orientation_west ) {
        state_player = move_south( metadata, state, board, state_player );
    }
    return state_player;    
} 

function turn_left( metadata, state, board, state_player ) {
    console.log( '[server] player ' + state_player.id + ' turns left...' );
    state_player.orientation = sanitize_orientation( state_player.orientation + 3 );
    return state_player; 
}

function turn_right( metadata, state, board, state_player ) {
    console.log( '[server] player ' + state_player.id + ' turns right...' );
    state_player.orientation = sanitize_orientation( state_player.orientation + 1 );
    return state_player; 
}

function uturn( metadata, state, board, state_player ) {
    console.log( '[server] player ' + state_player.id + ' uturns...' );
    state_player.orientation = sanitize_orientation( state_player.orientation + 2 );
    return state_player; 
}

function pause( metadata, state, board, state_player ) {
    return state_player; 
}

// //////////////////////////////////////////////////
// live

var live_max_points = 10;

function damage( metadata, state, board, state_player ) {
    state_player.live -= 1;
    console.log( '[server] player ' + state_player.id + ' damages itself: ' + state_player.live );
    if ( state_player.live <= 0 ) {
        return die( metadata, state, board, state_player );    
    }
    return state_player;
}

function repair( metadata, state, board, state_player ) {
    if ( state_player.live < live_max_points ) {
        state_player.live += 1;
        console.log( '[server] player ' + state_player.id + ' repairs itself: ' + state_player.live );
    }
    return state_player; 
}

function die( metadata, state, board, state_player ) {
    state_player.alive = false;
    state_player.live = 0;
    console.log( '[server] player ' + state_player.id + ' dies: ' + state_player.live );
    return state_player; 
}

// //////////////////////////////////////////////////
// move

function move_north( metadata, state, board, state_player ) {
    console.log( '[server] player ' + state_player.id + ' moves north...' );
    
    // wall
    var current_cell = get_cell( board, state_player.x, state_player.y ); 
    if ( current_cell.north ) {
        console.log( '[server] player ' + state_player.id + ' hits north wall.' );
        return damage( metadata, state, board, state_player );            
    }

    var target_cell = get_cell( board, state_player.x, state_player.y - 1 ); 
    return move_to_cell(  metadata, state, board, state_player, target_cell, move_north );    
}

function move_east( metadata, state, board, state_player ) {
    console.log( '[server] player ' + state_player.id + ' moves east...' );

    // wall
    var current_cell = get_cell( board, state_player.x, state_player.y ); 
    if ( current_cell.east ) {
        console.log( '[server] player ' + state_player.id + ' hits east wall.' );
        return damage( metadata, state, board, state_player );            
    }

    var target_cell  = get_cell( board, state_player.x + 1, state_player.y ); 
    return move_to_cell(  metadata, state, board, state_player, target_cell, move_east );        
}

function move_south( metadata, state, board, state_player ) {
    console.log( '[server] player ' + state_player.id + ' moves south...' );

    // wall
    var current_cell = get_cell( board, state_player.x, state_player.y ); 
    if ( current_cell.south ) {
        console.log( '[server] player ' + state_player.id + ' hits south wall.' );
        return damage( metadata, state, board, state_player );            
    }

    var target_cell = get_cell( board, state_player.x, state_player.y + 1 ); 
    return move_to_cell(  metadata, state, board, state_player, target_cell, move_south );        
}

function move_west( metadata, state, board, state_player ) {
    console.log( '[server] player ' + state_player.id + ' moves west...' );

    // wall
    var current_cell = get_cell( board, state_player.x, state_player.y ); 
    if ( current_cell.west ) {
        console.log( '[server] player ' + state_player.id + ' hits west wall.' );
        return damage( metadata, state, board, state_player );            
    }

    var target_cell = get_cell( board, state_player.x - 1, state_player.y );  
    return move_to_cell(  metadata, state, board, state_player, target_cell, move_west );
}

function move_to_cell( metadata, state, board, state_player, cell, push_fn ) {
    
    // out of board
    if ( !cell ) {
        console.log( '[server] player ' + state_player.id + ' falls out of board.' );
        state_player.x = null;
        state_player.y = null;
        return die( metadata, state, board, state_player );
    }
    
    // push other player if any
    var state_other_player = get_state_player_on_cell( state, cell );
    if ( state_other_player ) {
         console.log( '[server] player ' + state_player.id + ' will push player ' + state_other_player.id + ' to cell ' + cell.x + 'x' + cell.y + '...' );
         state_other_player = push_fn( metadata, state, board, state_other_player );
         state.players[ state_other_player.id ] = state_other_player;    
         // if other did not move, treat other robot as a wall
         if ( player_is_on_cell( state_other_player, cell ) ) {
            console.log( '[server] player ' + state_player.id + ' hits player ' + state_other_player.id + '.' );
            return damage( metadata, state, board, state_player );                                                                        
         }
         console.log( '[server] player ' + state_player.id + ' pushes player ' + state_other_player.id + ' to cell ' + state_other_player.x + 'x' + state_other_player.y + '.' );
    }
    
    // move  
    state_player.x = cell.x;
    state_player.y = cell.y;
    
    // hole
    if ( cell.hole ) {
        console.log( '[server] player ' + state_player.id + ' falls in hole ' + cell.x + '-' + cell.y + '.' );
        return die( metadata, state, board, state_player );            
    }
    
    console.log( '[server] player ' + state_player.id + ' moves to cell ' + cell.x + '-' + cell.y + '.' );
    return state_player;        
}

// //////////////////////////////////////////////////
// turn

var orientation_north = 4;
var orientation_east  = 1;
var orientation_south = 2;
var orientation_west  = 3;

function sanitize_orientation( orientation ) {
    orientation = orientation % 4;
    return orientation > 0 ? orientation : 4;
}

function generate_first_orientation() {
    return sanitize_orientation( Math.floor( Math.random() * 4 ) );    
}

// //////////////////////////////////////////////////
// player

function build_start_state( metadata, start_cells ) {
    // console.log( '[server] < build_start_state: metadata: ' + JSON.stringify( metadata ) );
    // console.log( '[server] < build_start_state: start_cells: ' + JSON.stringify( start_cells ) );
    var players = {};
    for ( var i = 0 ; i < metadata.orderOfPlay.length ; i++ ) {
        var plynd_player_id = metadata.orderOfPlay[ i ];
        var plynd_player = metadata.players[ plynd_player_id ];
        var cell = start_cells[ i ];
        var player = {};
        player.id = plynd_player_id;
        player.x = cell.x;
        player.y = cell.y;
        player.orientation = generate_first_orientation();
        player.active = ( plynd_player.status == 'has_turn' );
        player.cards = deal_player_cards( 10 );
        player.card_positions = null;
        player.alive = true;
        player.live = live_max_points;
        // console.log( '[server] < build_start_state: player: ' + JSON.stringify( player ) );
        players[ plynd_player_id ] = player;
    }
    // console.log( '[server] < build_start_state: players: ' + JSON.stringify( players ) );
    return players;
}

function build_turn_state( metadata, state ) {
    for ( var player_id in state.players ) {
        var player = state.players[ player_id ];
        console.log( '[server] player ' + player_id + ': ' + player.live + ' points.' );
        player.cards = deal_player_cards( player.live );
        player.card_positions = null;
        state.players[ player_id ] = player;
    }
    return state;
}

function get_current_player( metadata ) {
    return metadata.players[ metadata.ownPlayerID ];
}

function compute_winner_ids( metadata, state ) {
    var winner_ids = null;
    for ( var player_id in state.players ) {
        var player = state.players[ player_id ];
        if ( player.alive === false ) {
            continue;
        }
        if ( winner_ids ) {
            // two players alive > no winner
            return null;
        }     
        winner_ids = '' + player.id;
    }
    return winner_ids; 
}

function compute_eliminated_ids( metadata, state ) {
    var eliminated_ids = null;
    for ( var player_id in state.players ) {
        var player = state.players[ player_id ];
        if ( player.alive === true ) {
            continue;
        }
        var player_status = metadata.players[ player_id ].status;
        if ( player_status == 'eliminated' ) {
            continue;
        }
        if ( !eliminated_ids ) {
            eliminated_ids = '' + player.id;
        }
        else {     
            eliminated_ids = eliminated_ids + ',' + player.id;
        }
    }
    return eliminated_ids; 
}

// //////////////////////////////////////////////////
// server methods

function initialize_state( metadata, state ) {
    state = state || {};
    var board = get_board( metadata, state );
    var start_cells = fetch_start_cells( board );
    start_cells.sort( function() { return 0.5 - Math.random() } );
    state.players = build_start_state( metadata, start_cells );
    return state;    
}

Plynd.ServerFunctions.initializeState = function( request, success, error ) {
    try {
        Plynd.getGame( function( state, metadata ) {
            state = initialize_state( metadata, state );
            console.log( '[server] > initializeState: state: ' + JSON.stringify( state ) );
            success( state );
        } );
    }
    catch( err ) {
        console.log( '[server] exception: ' + err );
        console.log( err.stack );
        return error( { code:403, data: "Internal error! ( " + err + " )" } );
    }
}

Plynd.ServerFunctions.re_init = function( request, success, error ) {
    try {
        Plynd.getGame( function( state, metadata ) {
            state = initialize_state( metadata, state );
            console.log( '[server] > re_init: state: ' + JSON.stringify( state ) );
            Plynd.updateGame( state, state, success, error );
        } );
    }
    catch( err ) {
        console.log( '[server] exception: ' + err );
        console.log( err.stack );
        return error( { code:403, data: "Internal error! ( " + err + " )" } );
    }
}

Plynd.ServerFunctions.retrieve_board = function( request, success, error ) {
    try {
        // console.log( '[server] < retrieve_board: request: ' + JSON.stringify( request ) );
        Plynd.getGame( function( state, metadata ) {
            response = { board: get_board( metadata, state ) } ;
            // console.log( '[server] > retrieve_board: response: ' + JSON.stringify( response ) );
            success( response );
        } );
    }
    catch( err ) {
        console.log( '[server] retrieve_board: exception: ' + err );
        console.log( err.stack );
        return error( { code:403, data: "Internal error! ( " + err + " )" } );
    }
}

Plynd.ServerFunctions.play_cards = function( request, success, error ) {
    
    // console.log( '[server] > play_cards: request: ' + JSON.stringify( request ) );
    
    Plynd.getGame( function( state, metadata ) {
        try {
        
            var board = get_board( metadata, state );
            var player = get_current_player( metadata, state );
            console.log( '[server] > save_cards: player: ' + JSON.stringify( player ) );
            
            // apply directly
            // state = apply_cards( metadata, state, board, player, request.card_positions );
            
            state = save_cards( metadata, state, board, player, request.card_positions );
            console.log( '[server] > save_cards: cards: ' + JSON.stringify( request.card_positions ) );
    
            var event = { endTurn: true };
            
            if ( everyone_has_played( metadata, state ) ) {
                
                console.log( '[server] > triggre end of turn...' );
                
                // trigger end of turn
                state = apply_all_cards( metadata, state, board );
                
                // compute winner                
                var winnerID = compute_winner_ids( metadata, state );
                if ( winnerID ) {
                    event.winnerID = winnerID;    
                }
                
                // compute eliminated
                var eliminatedID = compute_eliminated_ids( metadata, state );
                if ( eliminatedID ) {
                    event.eliminatedID = eliminatedID;    
                }
                
                // reshuffle cards
                state = build_turn_state( metadata, state );
            }
            
            // save players           
            event.players = state.players;
            
            // console.log( '[server] > play_cards: event: ' + JSON.stringify( event ) );
            
            Plynd.updateGame( event, state, success, error );
            
        }
        catch( err ) {
            console.log( '[server] exception: ' + err );
            console.log( err.stack );
            return error( { code:403, data: "Internal error! ( " + err + " )" } );
        }
    } );
    
}
