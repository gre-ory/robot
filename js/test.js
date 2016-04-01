
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

function expect_robot_position( robot, x, y, o, p ) {
    var result = true;
    result &= expect_eq( 'robot_' + robot.id + '.x', robot.x, x );
    result &= expect_eq( 'robot_' + robot.id + '.y', robot.y, y );
    if ( robot.orientation.is_set() ) {
        result &= expect_eq( 'robot_' + robot.id + '.o', robot.orientation.flush(), o );
    }
    else if ( is_not_null( o ) ) {
        result &= expect_eq( 'robot_' + robot.id + '.o', null, o );
    }
    if ( p !== undefined ) {
        result &= expect_eq( 'robot_' + robot.id + '.p', robot.points, p );
    }
    if ( !result ) {
        console.log( '[test] ----- [x] robot: ' + robot.flush() );
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
            "playerName": "robot 41",
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
            "playerName": "robot 42",
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

assert_eq( 'test_metadata.boardID', test_metadata.boardID, 'test_board' );
var test_board = load_board_from_id( test_metadata.boardID );
assert_not_null( 'test_board', test_board );

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
    var robot = new Robot( 42 );
    expect_eq( 'robot.id', robot.id, 42 );
    expect_null( 'robot.cell', robot._cell );
    robot.initialize( cell );
    expect_not_null( 'robot.cell', robot._cell );
    expect_robot_position(robot, 0, 0, 'east');
    robot.move_forward();
    expect_robot_position(robot, 1, 0, 'east');
    robot.move_backward();
    expect_robot_position(robot, 0, 0, 'east');
    robot.slide_right();
    expect_robot_position(robot, 0, 1, 'east');
    robot.slide_left();
    expect_robot_position(robot, 0, 0, 'east');
    robot.turn_right();
    expect_robot_position(robot, 0, 0, 'south');
    robot.move_forward();
    expect_robot_position(robot, 0, 1, 'south');
    robot.move_backward();
    expect_robot_position(robot, 0, 0, 'south');
    robot.slide_left();
    expect_robot_position(robot, 1, 0, 'south');
    robot.slide_right();
    expect_robot_position(robot, 0, 0, 'south');
    robot.turn_right();
    expect_robot_position(robot, 0, 0, 'west');
    robot.move_backward();
    expect_robot_position(robot, 1, 0, 'west');
    robot.move_forward();
    expect_robot_position(robot, 0, 0, 'west');
    robot.slide_left();
    expect_robot_position(robot, 0, 1, 'west');
    robot.slide_right();
    expect_robot_position(robot, 0, 0, 'west');
    robot.turn_right();
    expect_robot_position(robot, 0, 0, 'north');
    robot.move_backward();
    expect_robot_position(robot, 0, 1, 'north');
    robot.move_forward();
    expect_robot_position(robot, 0, 0, 'north');
    robot.slide_right();
    expect_robot_position(robot, 1, 0, 'north');
    robot.slide_left();
    expect_robot_position(robot, 0, 0, 'north');
    robot.turn_left();
    expect_robot_position(robot, 0, 0, 'west');
    robot.uturn();
    expect_robot_position(robot, 0, 0, 'east');
    robot.uturn();
    expect_robot_position(robot, 0, 0, 'west');
    robot.turn_left();
    expect_robot_position(robot, 0, 0, 'south');
    robot.turn_left();
    expect_robot_position(robot, 0, 0, 'east');
}

{
    start_test( 'test board' );
    var board = test_board;
    var cell = board.get_cell( 0, 0 );
    expect_not_null( 'cell', cell );
    var robot = new Robot( 42 );
    expect_eq( 'robot.id', robot.id, 42 );
    expect_null( 'robot.cell', robot._cell );
    robot.initialize( cell );
    expect_not_null( 'robot.cell', robot._cell );
    expect_robot_position(robot, 0, 0, 'south', 10);
    // go hit the wall
    robot.move_forward();
    robot.turn_left();
    robot.move_forward();
    expect_robot_position(robot, 1, 1, 'east', 10);
    robot.move_forward();
    expect_robot_position(robot, 1, 1, 'east', 9);
    robot.move_forward();
    expect_robot_position(robot, 1, 1, 'east', 8);
    robot.move_forward();
    expect_robot_position(robot, 1, 1, 'east', 7);
    robot.move_backward();
    expect_robot_position(robot, 0, 1, 'east', 7);
    robot.move_backward();
    expect_robot_position(robot, null, null, null, 0);
}

{
    start_test( 'interaction' );
    var board = test_board; 
    var robot = new Robot( 42 );
    robot.initialize( board.get_cell( 0, 0 ) );
    expect_robot_position(robot, 0, 0, 'south', 10);
    var robot_2 = new Robot( 2 );
    robot_2.initialize( board.get_cell( 1, 1 ) );
    expect_robot_position(robot_2, 1, 1, 'north', 10);
    var robot_3 = new Robot( 3 );
    robot_3.initialize( board.get_cell( 1, 2 ) );
    expect_robot_position(robot_3, 1, 2, 'west', 10);
    var robot_4 = new Robot( 4 );
    robot_4.initialize( board.get_cell( 2, 2 ) );
    expect_robot_position(robot_4, 2, 2, 'west', 10);
    robot.move_forward();
    robot.turn_left();
    robot.move_forward();
    expect_robot_position(robot, 0, 1, 'east', 9);
    expect_robot_position(robot_2, 1, 1, 'north', 9);
    expect_robot_position(robot_3, 1, 2, 'west', 10);
    expect_robot_position(robot_4, 2, 2, 'west', 10);
    robot.slide_right();
    robot.move_forward();
    expect_robot_position(robot, 0, 2, 'east', 8);
    expect_robot_position(robot_2, 1, 1, 'north', 9);
    expect_robot_position(robot_3, 1, 2, 'west', 9);
    expect_robot_position(robot_4, 2, 2, 'west', 9);
    robot.slide_left();
    robot.slide_left();
    robot.move_forward();
    robot.turn_right();
    robot.move_forward();
    expect_robot_position(robot, 1, 1, 'south', 8);
    expect_robot_position(robot_2, 1, 2, 'north', 9);
    expect_robot_position(robot_3, null, null, null, 0);
    expect_robot_position(robot_4, 2, 2, 'west', 9);
}

{
    start_test( 'shoot' );
    var board = test_board;
    var robot = new Robot( 42 );
    robot.initialize( board.get_cell( 0, 0 ) );
    expect_robot_position(robot, 0, 0, 'east', 10);
    var robot_2 = new Robot( 2 );
    robot_2.initialize( board.get_cell( 3, 0 ) );
    expect_robot_position(robot_2, 3, 0, 'east', 10);
    robot.shoot();
    robot_2.uturn();
    robot_2.shoot();
    expect_robot_position(robot, 0, 0, 'east', 9);
    expect_robot_position(robot_2, 3, 0, 'west', 9);
    robot.slide_right();
    robot_2.slide_left();
    robot.shoot();
    robot_2.shoot();
    expect_robot_position(robot, 0, 1, 'east', 9);
    expect_robot_position(robot_2, 3, 1, 'west', 9);
    robot.turn_left();
    robot_2.turn_left();
    robot.shoot();
    robot_2.shoot();
    expect_robot_position(robot, 0, 1, 'north', 9);
    expect_robot_position(robot_2, 3, 1, 'south', 9);
}

{
    start_test( 'initialize & load & dump' );
    var state = new State( test_metadata, null );
    expect_not_null( 'board', state.get_board() );
    state.initialize();
    expect_not_null( 'board', state.get_board() );
    {
        {
            var robot = state.get_robot(41);
            expect_robot_position(robot, 3, 0, 'north', 10);
            expect_eq( 'robot[41].name', robot.name, 'robot 41' );
            expect_eq( 'robot[41].color', robot.color, '#a73338' );
            expect_eq( 'robot[41].status', robot.status, 'has_turn' );
        }
        {
            var robot = state.get_robot(42);
            expect_robot_position(robot, 0, 0, 'north', 10);
            expect_eq( 'robot[42].name', robot.name, 'robot 42' );
            expect_eq( 'robot[42].color', robot.color, '#538f5b' );
            expect_eq( 'robot[42].status', robot.status, 'has_turn' );
        }
        {
            var robot = state.get_robot(43);
            expect_robot_position(robot, 2, 2, 'east', 10);
            expect_null( 'robot[43].name', robot.name );
            expect_null( 'robot[43].color', robot.color );
            expect_null( 'robot[43].status', robot.status );
        }
    }
    {
        plynd_state = state.dump();
        plynd_state.robots['42'].p = 42;
        state = new State( test_metadata, plynd_state );
    }
    {
        {
            var robot = state.get_robot(41);
            expect_robot_position(robot, 3, 0, 'north', 10);
            expect_eq( 'robot[41].name', robot.name, 'robot 41' );
            expect_eq( 'robot[41].color', robot.color, '#a73338' );
            expect_eq( 'robot[41].status', robot.status, 'has_turn' );
        }
        {
            var robot = state.get_robot(42);
            expect_robot_position(robot, 0, 0, 'north', 42);
            expect_eq( 'robot[42].name', robot.name, 'robot 42' );
            expect_eq( 'robot[42].color', robot.color, '#538f5b' );
            expect_eq( 'robot[42].status', robot.status, 'has_turn' );
        }
        {
            var robot = state.get_robot(43);
            expect_robot_position(robot, 2, 2, 'east', 10);
            expect_null( 'robot[43].name', robot.name );
            expect_null( 'robot[43].color', robot.color );
            expect_null( 'robot[43].status', robot.status );
        }
    }
}

var test_plynd_state = null;

{
    start_test( 'server initialize' );
    server_initialize_state( test_metadata, null, null, function( plynd_state ) {
        test_plynd_state = plynd_state;
        expect_not_null( 'plynd_state', plynd_state );
        {
            assert_true( '41 in robots', '41' in plynd_state.robots );
            var plynd_robot = plynd_state.robots[ '41' ];
            expect_not_null( 'plynd_robot', plynd_robot );
            expect_eq( 'plynd_robot[41].x', plynd_robot.x, 0 );
            expect_eq( 'plynd_robot[41].y', plynd_robot.y, 0 );
            expect_eq( 'plynd_robot[41].o', plynd_robot.o, 3 );
            expect_eq( 'plynd_robot[41].p', plynd_robot.p, 10 );
            expect_eq( 'plynd_robot[41].h', plynd_robot.h.join(), 'L,1,r,l,1,s,s,1,L,b' );
        }
        {
            assert_true( '42 in robots', '42' in plynd_state.robots );
            var plynd_robot = plynd_state.robots[ '42' ];
            expect_not_null( 'plynd_robot', plynd_robot );
            expect_eq( 'plynd_robot[42].x', plynd_robot.x, 3 );
            expect_eq( 'plynd_robot[42].y', plynd_robot.y, 0 );
            expect_eq( 'plynd_robot[42].o', plynd_robot.o, 3 );
            expect_eq( 'plynd_robot[42].p', plynd_robot.p, 10 );
            expect_eq( 'plynd_robot[42].h', plynd_robot.h.join(), '1,r,2,l,r,2,l,b,2,1' );
        }
        {
            assert_true( '43 in robots', '43' in plynd_state.robots );
            var plynd_robot = plynd_state.robots[ '43' ];
            expect_not_null( 'plynd_robot', plynd_robot );
            expect_eq( 'plynd_robot[43].x', plynd_robot.x, 2 );
            expect_eq( 'plynd_robot[43].y', plynd_robot.y, 2 );
            expect_eq( 'plynd_robot[43].o', plynd_robot.o, 4 );
            expect_eq( 'plynd_robot[43].p', plynd_robot.p, 10 );
            expect_eq( 'plynd_robot[43].h', plynd_robot.h.join(), '3,2,1,2,1,3,l,r,R,u' );
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
    start_test( 'server_select_registers: errors' );
    test_metadata.ownPlayerID = '43';
    {
        var request_registers = null;
        server_select_registers( test_metadata, test_plynd_state, request_registers, forbidden_success_callback, function( new_plynd_state, err ) {
            expect_eq( 'error-1', err.data, '[error] robot 43: missing registers!' );
        } );
    }
    {
        var request_registers = { registers_mistyped: [ 7, 9, 6, 8, 0 ] };
        server_select_registers( test_metadata, test_plynd_state, request_registers, forbidden_success_callback, function( new_plynd_state, err ) {
            expect_eq( 'error-2', err.data, '[error] robot 43: missing registers!' );
        } );
    }
    {
        var request_registers = { registers: [ 7, 9, 6, 8 ] };
        server_select_registers( test_metadata, test_plynd_state, request_registers, forbidden_success_callback, function( new_plynd_state, err ) {
            expect_eq( 'error-3', err.data, '[error] robot 43: not enough registers!' );
        } );
    }
    {
        var request_registers = { registers: [ 7, 9, 6, 8, 1, 0 ] };
        server_select_registers( test_metadata, test_plynd_state, request_registers, forbidden_success_callback, function( new_plynd_state, err ) {
            expect_eq( 'error-4', err.data, '[error] robot 43: too much registers!' );
        } );
    }
    {
        var request_registers = { registers: [ 7, 9, 6, 9, 1 ] };
        server_select_registers( test_metadata, test_plynd_state, request_registers, forbidden_success_callback, function( new_plynd_state, err ) {
            expect_eq( 'error-5', err.data, '[error] robot 43: register 9 already selected!' );
        } );
    }
    {
        var request_registers = { registers: [ 7, -1, 6, 8, 0 ] };
        server_select_registers( test_metadata, test_plynd_state, request_registers, forbidden_success_callback, function( new_plynd_state, err ) {
            expect_eq( 'error-6', err.data, '[error] robot 43: invalid register: -1!' );
        } );
    }
    {
        var request_registers = { registers: [ 7, 1, 10, 8, 0 ] };
        server_select_registers( test_metadata, test_plynd_state, request_registers, forbidden_success_callback, function( new_plynd_state, err ) {
            expect_eq( 'error-7', err.data, '[error] robot 43: invalid register: 10!' );
        } );
    }
}

{
    start_test( 'server_select_registers: success' );
    {
        test_metadata.ownPlayerID = '43';
        var request_registers = { registers: [ 7, 9, 6, 8, 4 ] };
        server_select_registers( test_metadata, test_plynd_state, request_registers, function( new_plynd_state, response ) {
            expect_not_null( 'new_plynd_state', new_plynd_state );
            test_plynd_state = new_plynd_state;
            var robot = test_plynd_state.robots[ test_metadata.ownPlayerID ];
            expect_not_null( 'robot[' + test_metadata.ownPlayerID + ']', robot );
            expect_eq( 'robots[' + test_metadata.ownPlayerID + '].registers', robot.r.join(), '7,9,6,8,4' );
        }, forbidden_error_callback );
        // debug( 'state.robots[' + test_metadata.ownPlayerID + ']', test_plynd_state.robots[ test_metadata.ownPlayerID ] );
    }
    {
        test_metadata.ownPlayerID = '41';
        var request_registers = { registers: [ 3, 6, 4, 2, 7 ] };
        server_select_registers( test_metadata, test_plynd_state, request_registers, function( new_plynd_state, response ) {
            expect_not_null( 'new_plynd_state', new_plynd_state );
            test_plynd_state = new_plynd_state;
            var robot = test_plynd_state.robots[ test_metadata.ownPlayerID ];
            expect_not_null( 'robot[' + test_metadata.ownPlayerID + ']', robot );
            expect_eq( 'robots[' + test_metadata.ownPlayerID + '].registers', robot.r.join(), '3,6,4,2,7' );
        }, forbidden_error_callback );
        // debug( 'state.robots[' + test_metadata.ownPlayerID + ']', test_plynd_state.robots[ test_metadata.ownPlayerID ] );
    }
    {
        test_metadata.ownPlayerID = '42';
        var request_registers = { registers: [ 6, 4, 5, 1, 3 ] };
        server_select_registers( test_metadata, test_plynd_state, request_registers, function( new_plynd_state, response ) {
            expect_not_null( 'new_plynd_state', new_plynd_state );
            test_plynd_state = new_plynd_state;
            var robot = test_plynd_state.robots[ test_metadata.ownPlayerID ];
            expect_not_null( 'robot[' + test_metadata.ownPlayerID + ']', robot );
            expect_eq( 'robots[' + test_metadata.ownPlayerID + '].registers', robot.r.join(), '6,4,5,1,3' );
        }, forbidden_error_callback );
        // debug( 'state.robots[' + test_metadata.ownPlayerID + ']', test_plynd_state.robots[ test_metadata.ownPlayerID ] );
    }
    // debug( 'state.robots', test_plynd_state.robots );
}

test_report();
