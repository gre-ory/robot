
// //////////////////////////////////////////////////
// global

var _state;
var _metadata;
var _board;
var _players;
var _player;

// //////////////////////////////////////////////////
// event

function on_event( event, metadata ) {
    // console.log( ' > on_event: event: ' + JSON.stringify( event ) );
    metadata && on_metadata( metadata );
    event.board && on_board( event.board );
    event.players && on_players( event.players );
    update_display();
    // if ( metadata && status in metadata && ( metadata.status == 'game_is_over' ) ) {
}

function on_error( event, metadata ) {
    console.log( ' > on_error: event: ' + JSON.stringify( event ) );
    on_metadata( metadata );
    alert( 'error: ' + JSON.stringify( event ) );
}

function on_metadata( metadata ) {
    // log_debug( 'on_metadata: ', metadata );
    log_debug( 'on_metadata: ', '...' );
    _metadata = metadata;
}

function on_state( state ) {
    // log_debug( 'on_state: ', state );
    log_debug( 'on_state: ', '...' );
    _state = state;
}

function on_board( board ) {
    // log_debug( 'on_board: ', board );
    log_debug( 'on_board: ', '...' );
    _board = board;
}

function on_players( players ) {
    // log_debug( 'on_players: ', players ); 
    log_debug( 'on_players: ', '...' );
    _players = fill_players( players );
    _player = _players[ _metadata.ownPlayerID ];
    _player.card_positions = _player.card_positions || [];
    _player.allies = [];
    _player.enemies = [];
    for ( var player_id in _players ) {
        var enemy = _players[ player_id ];
        if ( enemy.id == _player.id ) {
            continue;
        }
        _player.enemies.push( enemy );        
    }
}

// //////////////////////////////////////////////////
// cell

function find_player_on_cell( cell ) {
    if ( _players ) {
        for ( var player_id in _players ) {
            var player = _players[ player_id ];
            if ( !player ) {
                continue;
            }
            if ( cell.x != player.x ) {
                continue;
            }
            if ( cell.y != player.y ) {
                continue;
            }
            return player;
        }
    }
    return null;
}

// //////////////////////////////////////////////////
// card

function is_played( i ) {
    return ( _player.card_positions.indexOf( i ) != -1 );
}

function play_card( i ) {
    console.log( 'play_card( ' + i + ' )' );
    _player.card_positions.push( i );
    update_display();
}

function unplay_card( i ) {
    console.log( 'unplay_card( ' + i + ' )' );
    _player.card_positions.splice( _player.card_positions.indexOf( i ), 1 );
    update_display();
}

// //////////////////////////////////////////////////
// player

function fill_player_from_id( player_id ) {
    return fill_player( { id: player_id } );
}

function fill_player( player ) {
    // console.log( 'fill_player: player: ' + JSON.stringify( player ) );
    var player_data = _metadata.players[ player.id ];
    player.name = player_data.playerName;
    player.color = player_data.playerColor;
    player.active = ( player_data.status == 'has_turn' );
    console.log( 'fill_player: player: ' + JSON.stringify( player ) );
    return player;
}

function fill_players( players ) {
    // console.log( 'fill_players: players: ' + JSON.stringify( players ) );
    for( var player_id in players ) {
        players[ player_id ] = fill_player( players[ player_id ] );    
    }
    // console.log( 'fill_players: players: ' + JSON.stringify( players ) );
    return players;
}

function build_current_player() {
    // console.log( 'build_current_player: metadata: ' + JSON.stringify( _metadata ) );
    var current_player = fill_player_from_id( _metadata.ownPlayerID );
    current_player.allies = [];
    current_player.enemies = [];
    for ( var player_id in _players ) {
        // console.log( 'build_current_player: player_id: ' + JSON.stringify( player_id ) );
        var enemy = _players( player_id );
        if ( enemy.id == current_player.id ) {
            continue;
        }
        current_player.enemies.push( enemy );        
    }
    // console.log( 'build_current_player: ' + JSON.stringify( current_player ) );
    return current_player;
}

// //////////////////////////////////////////////////
// html

function board_to_html() {
    board_html  = '';
    if ( _board ) {
        board_html += '<table id="board">';
        for ( var y = 0 ; y < _board.length ; y++ ) {
            var row = _board[ y ];
            
            if ( y == 0 ) {
                board_html += '<tr>';
                board_html += '<td data-border></td>';
                for ( var x = 0 ; x < row.length ; x++ ) {
                    board_html += '<td data-border></td>';
                }
                board_html += '<td data-border></td>';
                board_html += '</tr>';
            }
            
            board_html += '<tr>';
            board_html += '<td data-border></td>';
            for ( var x = 0 ; x < row.length ; x++ ) {
                var cell = row[ x ];
                var player = find_player_on_cell( cell );
                
                board_html += '<td data-x="' + cell.x + '" data-y="' + cell.y + '"';
                if ( cell.north ) { 
                    board_html += ' data-north';
                }
                if ( cell.south ) { 
                    board_html += ' data-south';
                }
                if ( cell.east ) { 
                    board_html += ' data-east';
                }
                if ( cell.west ) { 
                    board_html += ' data-west';
                }
                if ( cell.hole ) { 
                    board_html += ' data-hole';
                }
                if ( cell.start ) { 
                    board_html += ' data-start';
                }
                if ( cell.end ) { 
                    board_html += ' data-end';
                }
                if ( cell.step ) { 
                    board_html += ' data-step="' + cell.step + '"';
                }
                board_html += '>';
                if ( player ) {
                    board_html += robot_to_html( player );     
                }
                board_html += '</td>';
            } 
            board_html += '<td data-border></td>';
            board_html += '</tr>';
            
            if ( y == ( _board.length - 1 ) ) {
                board_html += '<tr>';
                board_html += '<td data-border></td>';
                for ( var x = 0 ; x < row.length ; x++ ) {
                    board_html += '<td data-border></td>';
                }
                board_html += '<td data-border></td>';
                board_html += '</tr>';
            }
        }
        board_html += '</table>';
    }
    else {
        board_html += 'error while loading the board!'    
    }
    return board_html;
}

function robot_to_html( player ) {
    var robot_html = '';
    robot_html += '<div';
    robot_html += ' class="robot btn btn-default btn-xs orientation-' + ( player.orientation || '' ) + ' ' +  ( player.active ? 'active' : 'inactive' ) + '"';
    robot_html += ' title="robot: ' + player.name + '">';
    robot_html += '<span class="icon" title="robot: ' + player.name + '" style="color:' + player.color + ';"></span>';
    robot_html += '</div>'; 
    return robot_html;
}

function player_to_html( player ) {
    var player_html = '';
    player_html += '<li class="list-group-item" title="' + player.id + ' - ' + player.name + '">';
    player_html += '<span class="icon icon-player"  style="color:' + player.color + ';"></span>';
    player_html += '<span class="badge">' + player.live + '</span>';
    player_html += player.name;
    player_html += '</li>';
    return player_html    
}

function players_to_html( player, allies, enemies ) {
    var players_html = '';
    
    players_html += '<div class="panel panel-default">';
    players_html += '<div class="panel-heading">players</div>';
    players_html += '<ul class="list-group">';
    
    if ( player ) {
        players_html += player_to_html( player );        
        if ( player.allies && player.allies.length > 0 ) {
            for ( var i = 0 ; i < player.allies.length ; i++ ) {
                players_html += player_to_html( player.allies[ i ] );  
            }
        }
        if ( player.enemies && player.enemies.length > 0 ) {
            for ( var i = 0 ; i < player.enemies.length ; i++ ) {
                players_html += player_to_html( player.enemies[ i ] );  
            }
        }
    }
    
    players_html += '</ul>';
    players_html += '</div>';

    return players_html;
}

// //////////////////////////////////////////////////
// display

function display_board() {
    if ( _board ) {
        $( '#board_container' ).html( board_to_html( _board, _player ) );
    } 
}

function display_player() {
    if ( _player ) {
        // $( '#player_container' ).html( player_to_html( _player ) );
        if ( _player.active ) {
            $( '#button_container' ).html( '<button id="initialize" class="btn btn-success pull-right">initialize</button>' );
            $( '#initialize' ).on( 'click', function() { initialize_game() } );
        }
    }
}

function display_players() {
    if ( _player ) {
        $( '#players_container' ).html( players_to_html( _player ) );
    } 
}

function display_cards() {
    console.log( _player );
    if ( _player && _player.active ) {
        var card_positions = _player.card_positions || [];
        var cards = _player.cards || [];
        {
            var cards_html = '';
            for ( var i = 0 ; i < card_positions.length ; i++ ) {
                var card_position = card_positions[ i ];
                var card = cards[ card_position ];
                var played = ( card_positions.indexOf( card_position ) != -1 );
                cards_html += '<button';
                cards_html += ' class="card btn btn-success action_' + card + '"';
                cards_html += ' onclick="unplay_card(' + card_position + ');"';
                cards_html += ' title="action: ' + card + '">';
                cards_html += '<span class="icon" title="action: ' + card + '"></span>';
                cards_html += '</button>';    
            }
            for ( var i = card_positions.length ; i < 5 ; i++ ) {
                var card_position = card_positions[ i ];
                var card = cards[ card_position ];
                var played = ( card_positions.indexOf( card_position ) != -1 );
                cards_html += '<button';
                cards_html += ' class="card btn btn-default action_undefined"';
                cards_html += ' disabled="true"';
                cards_html += ' title="action: ?">';
                cards_html += '<span class="icon" title="action: ?"></span>';
                cards_html += '</button>';    
            }
            if ( cards.length > 0 ) {
                cards_html += '<button';
                cards_html += ' class="btn btn-success pull-right"';
                cards_html += ' onclick="play_cards();"';
                cards_html += ' title="validate cards">';
                cards_html += 'ok';
                cards_html += '</button>';
            } 
            $( '#played_cards_container' ).html( cards_html );
        }
        {
            var cards_html = '';
            {
                for ( var i = 0 ; i < cards.length ; i++ ) {
                    var card_position = i;
                    var card = cards[ card_position ];
                    var played = ( card_positions.indexOf( card_position ) != -1 );
                    cards_html += '<button';
                    if ( played ) {
                        cards_html += ' class="card btn btn-default action_' + card + '"';
                        cards_html += ' disabled="true"';
                    }
                    else {
                        cards_html += ' class="card btn btn-primary action_' + card + '"';
                        cards_html += ' onclick="play_card(' + card_position + ');"';
                    }
                    cards_html += ' title="action: ' + card + '">';
                    cards_html += '<span class="icon" title="action: ' + card + '"></span>';
                    cards_html += '</button>';    
                }
            }
            $( '#cards_container' ).html( cards_html );
        }
    }
    else {
        $( '#played_cards_container' ).html( '' );
        $( '#cards_container' ).html( 'waiting your turn... =)' );    
    } 
}

function update_display() {
    // $("#state_container").html( JSON.stringify( state, null, 4 ) );
    // $("#metadata_container").html( JSON.stringify( metadata, null, 4 ) );
    
    display_board();
    display_player();
    display_players();
    display_cards();
}

// //////////////////////////////////////////////////
// log

function log_debug( param1, param2 ) {
    if ( param1 && param2 ) {
        console.log( param1 + ': ' + JSON.stringify( param2, null, 4 ) );
    }
    else {
        console.log( JSON.stringify( param1, null, 4 ) );
    }    
}

// //////////////////////////////////////////////////
// game

function initialize_game() {
    Plynd.call( 're_init', {}, on_event, on_error );
}

function play_cards() {
    Plynd.call( 'play_cards', { card_positions: _player.card_positions }, on_event, on_error );
}

Plynd.getGame( function( state, metadata ) {
    metadata && on_metadata( metadata );
    state && on_state( state );
    if ( _state.players ) {
        on_players( _state.players );
    }
    if ( !_board ) {
        Plynd.call( 'retrieve_board', {}, on_event, on_error );
    }
    update_display();
} );
