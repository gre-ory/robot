
// //////////////////////////////////////////////////
//  helper

var _debug = false;
var _current_test = null;
var _nb_success = 0;
var _nb_total = 0;

function start_test( msg ) {
    test_report();
    console.log( '' );
    console.log( '[test] ' + msg + '...' );
    _current_test = msg;
}

function test_report() {
    if ( is_not_null( _current_test ) && ( _nb_total > 0 ) ) {
        if ( _nb_success == _nb_total ) {
            console.log( '[test] ' + _current_test + ': OK (' + _nb_success + '/' + _nb_total + ')' );
        }
        else {
            throw '[test] ' + _current_test + ': FAILED! (' + _nb_success + '/' + _nb_total + ')';
        }
    }
    _current_test = null;
    _nb_success = 0;
    _nb_total = 0;
}

function expect_test( msg, computed, throw_error ) {
    _nb_total += 1;
    if ( !computed ) {
        console.log( '[test] ----- [x] ' + msg );
        if ( throw_error ) {
            throw msg;
        }
        return false;
    }
    if ( _debug ) {
        console.log( '[test] ----- [ ] ' + msg );
    }
    _nb_success += 1;
    return true;
}

function expect_true( msg, computed, throw_error ) {
    return expect_test( msg + ' is true', is_true( computed ), throw_error );
}

function expect_false( msg, computed, throw_error ) {
    return expect_test( msg + ' is false', is_false( computed ), throw_error );
}

function expect_null( msg, computed, throw_error ) {
    return expect_test( msg + ' is null', is_null( computed ), throw_error );
}

function expect_not_null( msg, computed, throw_error ) {
    return expect_test( msg + ' is not null', is_not_null( computed ), throw_error );
}

function expect_eq( msg, computed, expected, throw_error ) {
    return expect_test( msg + ': ' + computed + ' == ' + expected, ( computed == expected ), throw_error );
}

function expect_player_position( player, x, y, o, p ) {
    var result = true;
    result &= expect_eq( 'player_' + player.id + '.x', player.x, x );
    result &= expect_eq( 'player_' + player.id + '.y', player.y, y );
    if ( player.orientation.is_set() ) {
        result &= expect_eq( 'player_' + player.id + '.o', player.orientation.flush(), o );
    }
    else if ( is_not_null( o ) ) {
        result &= expect_eq( 'player_' + player.id + '.o', null, o );
    }
    if ( p !== undefined ) {
        result &= expect_eq( 'player_' + player.id + '.p', player.points, p );
    }
    if ( !result ) {
        console.log( '[test] ----- [x] player: ' + player.flush() );
    }
    return result;
}

function assert_true( msg, computed ) {
    expect_true( msg, computed, true );
}

function assert_false( msg, computed ) {
    expect_false( msg, computed, true );
}

function assert_null( msg, computed ) {
    expect_null( msg, computed, true );
}

function assert_not_null( msg, computed ) {
    expect_not_null( msg, computed, true );
}

function assert_eq( msg, computed, expected ) {
    expect_eq( msg, computed, expected, true );
}

function forbidden_success_callback() {
    expect_test( 'success callback should NOT be called!', false, false );
}

function forbidden_error_callback() {
    expect_test( 'error callback should NOT be called!', false, false );
}

// //////////////////////////////////////////////////
//  data

var test_metadata = {
    boardID: 'test_board',
    orderOfPlay: [ '41', '42', '43' ],
    ownPlayerID: '42',
    players: {
        "41": {
            "playerID": 41,
            "playerName": "player 41",
            "playerColor": "#a73338",
            "status": "has_turn",
            "user": {
                "userID": 41,
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
        "42": {
            "playerID": 42,
            "playerName": "player 42",
            "playerColor": "#538f5b",
            "status": "has_turn",
            "user": {
                "userID": 0,
                "firstName": "Gregory",
                "country": {
                    "code": "FR",
                    "name": "France"
                },
                "lastName": "Valigiani",
                "name": "Gregory Valigiani",
                "picture": "http://picture.plynd.com/9O7aZtZY19oVhI4iaVn1r5X5IYNaHV.jpg"
            }
        }
    }
};

expect_eq( 'test_metadata.boardID', test_metadata.boardID, 'test_board' );
var test_board = load_board_from_id( test_metadata.boardID );
expect_not_null( 'test_board', test_board );

// //////////////////////////////////////////////////
//  random

random = new Random( 42 );

{
    start_test( 'random' );
    expect_eq( '1st', 2, random.number( 10 ) );
    expect_eq( '2nd', 0, random.number( 10 ) );
    expect_eq( '3rd', 0, random.number( 10 ) );
    expect_eq( '4th', 8, random.number( 10 ) );
    expect_eq( '5th', 7, random.number( 10 ) );
    expect_eq( '6th', 4, random.number( 10 ) );
    expect_eq( '7th', 4, random.number( 10 ) );
    expect_eq( '8th', 2, random.number( 10 ) );
    expect_eq( '9th', 2, random.number( 10 ) );
}

// //////////////////////////////////////////////////
//  test board

{
    start_test( 'empty board' );
    var board = new Board();
    assert_not_null( 'board', board );
    var cell = board.get_cell( 0, 0 );
    expect_null( 'cell', cell );
    var start_cells = board.get_start_cells();
    expect_null( 'start_cells', start_cells );
}

{
    start_test( 'unknown board' );
    var board = load_board_from_id( 'unknown' );
    expect_null( 'board', board );
}

{
    start_test( 'simple board & simple moves' );
    var board = load_board_from_id( 'simple_board' );
    expect_not_null( 'board', board );
    var cell = board.get_cell( 0, 0 );
    expect_not_null( 'cell', cell );
    var start_cells = board.get_start_cells();
    assert_not_null( 'start_cells', start_cells );
    expect_eq( 'start_cells.length', start_cells.length, 0 );
    var player = new Player( 42 );
    expect_eq( 'player.id', player.id, 42 );
    expect_null( 'player.cell', player._cell );
    player.initialize( cell );
    expect_not_null( 'player.cell', player._cell );
    expect_player_position(player, 0, 0, 'east');
    player.move_forward();
    expect_player_position(player, 1, 0, 'east');
    player.move_backward();
    expect_player_position(player, 0, 0, 'east');
    player.slide_right();
    expect_player_position(player, 0, 1, 'east');
    player.slide_left();
    expect_player_position(player, 0, 0, 'east');
    player.turn_right();
    expect_player_position(player, 0, 0, 'south');
    player.move_forward();
    expect_player_position(player, 0, 1, 'south');
    player.move_backward();
    expect_player_position(player, 0, 0, 'south');
    player.slide_left();
    expect_player_position(player, 1, 0, 'south');
    player.slide_right();
    expect_player_position(player, 0, 0, 'south');
    player.turn_right();
    expect_player_position(player, 0, 0, 'west');
    player.move_backward();
    expect_player_position(player, 1, 0, 'west');
    player.move_forward();
    expect_player_position(player, 0, 0, 'west');
    player.slide_left();
    expect_player_position(player, 0, 1, 'west');
    player.slide_right();
    expect_player_position(player, 0, 0, 'west');
    player.turn_right();
    expect_player_position(player, 0, 0, 'north');
    player.move_backward();
    expect_player_position(player, 0, 1, 'north');
    player.move_forward();
    expect_player_position(player, 0, 0, 'north');
    player.slide_right();
    expect_player_position(player, 1, 0, 'north');
    player.slide_left();
    expect_player_position(player, 0, 0, 'north');
    player.turn_left();
    expect_player_position(player, 0, 0, 'west');
    player.uturn();
    expect_player_position(player, 0, 0, 'east');
    player.uturn();
    expect_player_position(player, 0, 0, 'west');
    player.turn_left();
    expect_player_position(player, 0, 0, 'south');
    player.turn_left();
    expect_player_position(player, 0, 0, 'east');
}

{
    start_test( 'test board' );
    var board = test_board;
    var cell = board.get_cell( 0, 0 );
    expect_not_null( 'cell', cell );
    var player = new Player( 42 );
    expect_eq( 'player.id', player.id, 42 );
    expect_null( 'player.cell', player._cell );
    player.initialize( cell );
    expect_not_null( 'player.cell', player._cell );
    expect_player_position(player, 0, 0, 'south', 10);
    // go hit the wall
    player.move_forward();
    player.turn_left();
    player.move_forward();
    expect_player_position(player, 1, 1, 'east', 10);
    player.move_forward();
    expect_player_position(player, 1, 1, 'east', 9);
    player.move_forward();
    expect_player_position(player, 1, 1, 'east', 8);
    player.move_forward();
    expect_player_position(player, 1, 1, 'east', 7);
    player.move_backward();
    expect_player_position(player, 0, 1, 'east', 7);
    player.move_backward();
    expect_player_position(player, null, null, null, 0);
}

{
    start_test( 'interaction' );
    var board = test_board; 
    var player = new Player( 42 );
    player.initialize( board.get_cell( 0, 0 ) );
    expect_player_position(player, 0, 0, 'south', 10);
    var player_2 = new Player( 2 );
    player_2.initialize( board.get_cell( 1, 1 ) );
    expect_player_position(player_2, 1, 1, 'north', 10);
    var player_3 = new Player( 3 );
    player_3.initialize( board.get_cell( 1, 2 ) );
    expect_player_position(player_3, 1, 2, 'west', 10);
    var player_4 = new Player( 4 );
    player_4.initialize( board.get_cell( 2, 2 ) );
    expect_player_position(player_4, 2, 2, 'west', 10);
    player.move_forward();
    player.turn_left();
    player.move_forward();
    expect_player_position(player, 0, 1, 'east', 9);
    expect_player_position(player_2, 1, 1, 'north', 9);
    expect_player_position(player_3, 1, 2, 'west', 10);
    expect_player_position(player_4, 2, 2, 'west', 10);
    player.slide_right();
    player.move_forward();
    expect_player_position(player, 0, 2, 'east', 8);
    expect_player_position(player_2, 1, 1, 'north', 9);
    expect_player_position(player_3, 1, 2, 'west', 9);
    expect_player_position(player_4, 2, 2, 'west', 9);
    player.slide_left();
    player.slide_left();
    player.move_forward();
    player.turn_right();
    player.move_forward();
    expect_player_position(player, 1, 1, 'south', 8);
    expect_player_position(player_2, 1, 2, 'north', 9);
    expect_player_position(player_3, null, null, null, 0);
    expect_player_position(player_4, 2, 2, 'west', 9);
}

{
    start_test( 'shoot' );
    var board = test_board;
    var player = new Player( 42 );
    player.initialize( board.get_cell( 0, 0 ) );
    expect_player_position(player, 0, 0, 'east', 10);
    var player_2 = new Player( 2 );
    player_2.initialize( board.get_cell( 3, 0 ) );
    expect_player_position(player_2, 3, 0, 'east', 10);
    player.shoot();
    player_2.uturn();
    player_2.shoot();
    expect_player_position(player, 0, 0, 'east', 9);
    expect_player_position(player_2, 3, 0, 'west', 9);
    player.slide_right();
    player_2.slide_left();
    player.shoot();
    player_2.shoot();
    expect_player_position(player, 0, 1, 'east', 9);
    expect_player_position(player_2, 3, 1, 'west', 9);
    player.turn_left();
    player_2.turn_left();
    player.shoot();
    player_2.shoot();
    expect_player_position(player, 0, 1, 'north', 9);
    expect_player_position(player_2, 3, 1, 'south', 9);
}

{
    start_test( 'initialize & load & dump' );
    var state = new State( test_metadata, null );
    expect_not_null( 'board', state.get_board() );
    state.initialize();
    expect_not_null( 'board', state.get_board() );
    {
        expect_player_position(state.get_player(41), 3, 0, 'north', 10);
        expect_player_position(state.get_player(42), 0, 0, 'north', 10);
        expect_player_position(state.get_player(43), 2, 2, 'east', 10);
    }
    {
        plynd_state = state.dump();
        plynd_state.players['42'].p = 42;
        state = new State( test_metadata, plynd_state );
    }
    {
        expect_player_position(state.get_player(41), 3, 0, 'north', 10);
        expect_player_position(state.get_player(42), 0, 0, 'north', 42);
        expect_player_position(state.get_player(43), 2, 2, 'east', 10);
    }
}

var test_plynd_state = null;

{
    start_test( 'server initialize' );
    server_initialize_state( test_metadata, null, null, function( plynd_state ) {
        test_plynd_state = plynd_state;
        expect_not_null( 'plynd_state', plynd_state );
        {
            assert_true( '41 in players', '41' in plynd_state.players );
            var plynd_player = plynd_state.players[ '41' ];
            expect_not_null( 'plynd_player', plynd_player );
            expect_eq( 'plynd_player[41].x', plynd_player.x, 0 );
            expect_eq( 'plynd_player[41].y', plynd_player.y, 0 );
            expect_eq( 'plynd_player[41].o', plynd_player.o, 3 );
            expect_eq( 'plynd_player[41].p', plynd_player.p, 10 );
            expect_eq( 'plynd_player[41].h', plynd_player.h.join(), 'r,f,b,b,f2,l,l,f,r,f' );
        }
        {
            assert_true( '42 in players', '42' in plynd_state.players );
            var plynd_player = plynd_state.players[ '42' ];
            expect_not_null( 'plynd_player', plynd_player );
            expect_eq( 'plynd_player[42].x', plynd_player.x, 3 );
            expect_eq( 'plynd_player[42].y', plynd_player.y, 0 );
            expect_eq( 'plynd_player[42].o', plynd_player.o, 3 );
            expect_eq( 'plynd_player[42].p', plynd_player.p, 10 );
            expect_eq( 'plynd_player[42].h', plynd_player.h.join(), 'f2,u,f2,sl,b,f2,sr,f,f3,f' );
        }
        {
            assert_true( '43 in players', '43' in plynd_state.players );
            var plynd_player = plynd_state.players[ '43' ];
            expect_not_null( 'plynd_player', plynd_player );
            expect_eq( 'plynd_player[43].x', plynd_player.x, 2 );
            expect_eq( 'plynd_player[43].y', plynd_player.y, 2 );
            expect_eq( 'plynd_player[43].o', plynd_player.o, 4 );
            expect_eq( 'plynd_player[43].p', plynd_player.p, 10 );
            expect_eq( 'plynd_player[43].h', plynd_player.h.join(), 'f3,f2,f2,f2,f,f3,sr,u,r,sl' );
        }
    }, forbidden_error_callback );
}

{
    start_test( 'server retrieve board' );
    server_initialize_state( test_metadata, null, null, function( board ) {
        expect_not_null( 'board', board );
    }, forbidden_error_callback );
}

{
    start_test( 'server set move: errors' );
    test_metadata.ownPlayerID = '43';
    {
        var move_request = null;
        server_set_move( test_metadata, test_plynd_state, move_request, forbidden_success_callback, function( err ) {
            expect_eq( 'error-1', err.data, '[error] player 43: missing move!' );
        } );
    }
    {
        var move_request = { move_mistyped: [ 7, 9, 6, 8, 0 ] };
        server_set_move( test_metadata, test_plynd_state, move_request, forbidden_success_callback, function( err ) {
            expect_eq( 'error-2', err.data, '[error] player 43: missing move!' );
        } );
    }
    {
        var move_request = { move: [ 7, 9, 6, 8 ] };
        server_set_move( test_metadata, test_plynd_state, move_request, forbidden_success_callback, function( err ) {
            expect_eq( 'error-3', err.data, '[error] player 43: not enough card card played!' );
        } );
    }
    {
        var move_request = { move: [ 7, 9, 6, 8, 1, 0 ] };
        server_set_move( test_metadata, test_plynd_state, move_request, forbidden_success_callback, function( err ) {
            expect_eq( 'error-4', err.data, '[error] player 43: too much card played!' );
        } );
    }
    {
        var move_request = { move: [ 7, 9, 6, 9, 1 ] };
        server_set_move( test_metadata, test_plynd_state, move_request, forbidden_success_callback, function( err ) {
            expect_eq( 'error-5', err.data, '[error] player 43: card index already played! (9)' );
        } );
    }
    {
        var move_request = { move: [ 7, -1, 6, 8, 0 ] };
        server_set_move( test_metadata, test_plynd_state, move_request, forbidden_success_callback, function( err ) {
            expect_eq( 'error-6', err.data, '[error] player 43: invalid card index! (-1)' );
        } );
    }
    {
        var move_request = { move: [ 7, 1, 10, 8, 0 ] };
        server_set_move( test_metadata, test_plynd_state, move_request, forbidden_success_callback, function( err ) {
            expect_eq( 'error-7', err.data, '[error] player 43: invalid card index! (10)' );
        } );
    }
}

{
    start_test( 'server set move: success' );
    {
        test_metadata.ownPlayerID = '43';
        var move_request = { move: [ 7, 9, 6, 8, 4 ] };
        server_set_move( test_metadata, test_plynd_state, move_request, function( plynd_state ) {
            expect_not_null( 'plynd_state', plynd_state );
            test_plynd_state = plynd_state;
            var player = test_plynd_state.players[ test_metadata.ownPlayerID ];
            expect_not_null( 'player[' + test_metadata.ownPlayerID + ']', player );
            expect_eq( 'players[' + test_metadata.ownPlayerID + '].move', player.m.join(), '7,9,6,8,4' );
        }, forbidden_error_callback );
        // debug( 'state.players[' + test_metadata.ownPlayerID + ']', test_plynd_state.players[ test_metadata.ownPlayerID ] );
    }
    {
        test_metadata.ownPlayerID = '41';
        var move_request = { move: [ 3, 6, 4, 2, 7 ] };
        server_set_move( test_metadata, test_plynd_state, move_request, function( plynd_state ) {
            expect_not_null( 'plynd_state', plynd_state );
            test_plynd_state = plynd_state;
            var player = test_plynd_state.players[ test_metadata.ownPlayerID ];
            expect_not_null( 'player[' + test_metadata.ownPlayerID + ']', player );
            expect_eq( 'players[' + test_metadata.ownPlayerID + '].move', player.m.join(), '3,6,4,2,7' );
        }, forbidden_error_callback );
        // debug( 'state.players[' + test_metadata.ownPlayerID + ']', test_plynd_state.players[ test_metadata.ownPlayerID ] );
    }
    {
        test_metadata.ownPlayerID = '42';
        var move_request = { move: [ 6, 4, 5, 1, 3 ] };
        server_set_move( test_metadata, test_plynd_state, move_request, function( plynd_state ) {
            expect_not_null( 'plynd_state', plynd_state );
            test_plynd_state = plynd_state;
            var player = test_plynd_state.players[ test_metadata.ownPlayerID ];
            expect_not_null( 'player[' + test_metadata.ownPlayerID + ']', player );
            expect_eq( 'players[' + test_metadata.ownPlayerID + '].move', player.m.join(), '6,4,5,1,3' );
        }, forbidden_error_callback );
        // debug( 'state.players[' + test_metadata.ownPlayerID + ']', test_plynd_state.players[ test_metadata.ownPlayerID ] );
    }
    // debug( 'state.players', test_plynd_state.players );
}

test_report();
