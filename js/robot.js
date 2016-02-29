
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
    log_debug( 'on_metadata: ', metadata );
    log_debug( 'on_metadata: ', '...' );
    _metadata = metadata;
}

function on_state( state ) {
    log_debug( 'on_state: ', state );
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
    if ( _metadata.status == 'game_is_over' ) {
        player.winner = ( player_data.status == 'winner' );
        player.active = null;
    }
    else {
        player.winner = null;
        player.active = ( player_data.status == 'has_turn' );
    }
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

function html_board() {
    var html = '';
    var html_border_cell = '<div class="cell col-xs-1 col-sm-1 col-md-1 col-lg-1" data-border></div>';
    if ( _board ) {
        html += '<div class="board container-fluid">';
        for ( var y = 0 ; y < _board.length ; y++ ) {
            var row = _board[ y ];
            
            if ( y == 0 ) {
                html += '<div class="row">';
                html += html_border_cell;
                for ( var x = 0 ; x < row.length ; x++ ) {
                    html += html_border_cell;
                }
                html += html_border_cell;
                html += '</div>';
            }
            
            html += '<div class="row">';
            html += html_border_cell;
            for ( var x = 0 ; x < row.length ; x++ ) {
                var cell = row[ x ];
                var player = find_player_on_cell( cell );
                
                html += '<div class="cell col-xs-1 col-sm-1 col-md-1 col-lg-1" data-x="' + cell.x + '" data-y="' + cell.y + '"';
                if ( cell.north ) { 
                    html += ' data-north';
                }
                if ( cell.south ) { 
                    html += ' data-south';
                }
                if ( cell.east ) { 
                    html += ' data-east';
                }
                if ( cell.west ) { 
                    html += ' data-west';
                }
                if ( cell.hole ) { 
                    html += ' data-hole';
                }
                if ( cell.start ) { 
                    html += ' data-start';
                }
                if ( cell.end ) { 
                    html += ' data-end';
                }
                if ( cell.step ) { 
                    html += ' data-step="' + cell.step + '"';
                }
                html += '>';
                if ( player ) {
                    html += robot_to_html( player );     
                }
                else {
                    html += '&nbsp;';     
                }
                html += '</div>';
            } 
            html += html_border_cell;
            html += '</div>';
            
            if ( y == ( _board.length - 1 ) ) {
                html += '<div class="row">';
                html += html_border_cell;
                for ( var x = 0 ; x < row.length ; x++ ) {
                    html += html_border_cell;
                }
                html += html_border_cell;
                html += '</div>';
            }
        }
        html += '</div>';
    }
    else {
        html += '<div class="alert alert-danger" role="alert">error while loading the board!</div>';
    }
    return html;
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

function html_players( player ) {
    var html = '';
    
    // html += '<div class="panel panel-default">';
    // html += '<div class="panel-heading">players</div>';
    html += '<ul class="list-group">';
    
    if ( player ) {
        html += player_to_html( player );        
        if ( player.allies && player.allies.length > 0 ) {
            for ( var i = 0 ; i < player.allies.length ; i++ ) {
                html += player_to_html( player.allies[ i ] );  
            }
        }
        if ( player.enemies && player.enemies.length > 0 ) {
            for ( var i = 0 ; i < player.enemies.length ; i++ ) {
                html += player_to_html( player.enemies[ i ] );  
            }
        }
    }
    
    html += '</ul>';
    // html += '</div>';
    // html += '</div>';

    return html;
}

function html_button_restart( disabled ) {
    var html = '';
    html += '<button';
    html += ' class="btn btn-success pull-right"';
    html += ' onclick="initialize_game();"';
    if ( disabled ) {
        html += ' disabled="true"';
    }
    html += ' title="restart game">';
    html += 'restart';
    html += '</button>';
    return html;
}

function html_button_play( disabled ) {
    var html = '';
    html += '<button';
    html += ' class="btn btn-success"';
    html += ' onclick="play_cards();"';
    if ( disabled ) {
        html += ' disabled="true"';
    }
    html += ' title="play cards">';
    html += 'play';
    html += '</button>';
    return html;
}

// //////////////////////////////////////////////////
// display

var max_played_cards = 5;

function display_board() {
    if ( _board ) {
        $( '#board_container' ).html( html_board( _board, _player ) );
    } 
}

function display_players() {
    if ( _player ) {
        $( '#players_container' ).html( html_players( _player ) );
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
            for ( var i = card_positions.length ; i < max_played_cards ; i++ ) {
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
            cards_html += html_button_play( ( card_positions.length <= 0 ) );
            cards_html += html_button_restart( !_player.active );
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
                        if ( max_played_cards <= card_positions.length ) {
                            cards_html += ' disabled="true"';
                        }
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
        if ( _player.winner === true ) {
            $( '#cards_container' ).html( '<div class="alert alert-success" role="alert">you win! =)</div>' );
        }
        else if ( _player.winner === false ) {
            $( '#cards_container' ).html( '<div class="alert alert-warning" role="alert">you loose! =(</div>' );
        }
        else {
            $( '#cards_container' ).html( '<div class="alert alert-info" role="alert">wait your turn! =)</div>' );
        }  
    } 
}

function update_display() {
    display_board();
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
// onclick

function initialize_game() {
    Plynd.call( 're_init', {}, on_event, on_error );
}

function play_cards() {
    Plynd.call( 'play_cards', { card_positions: _player.card_positions }, on_event, on_error );
}

// //////////////////////////////////////////////////
// game

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
