
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

function expect_exception( msg, fn, throw_error ) {
    try {
        fn.apply();
        expect_test( msg + ': exception is NOT catched!', ( false ), throw_error );
    }
    catch( err ) {
        expect_test( msg + ': exception is catched!', ( true ), throw_error );
    }
}

function expect_robot_position( robot, x, y, o, p ) {
    var result = true;
    result &= expect_eq( 'robot_' + robot.id + '.x', robot.x, x );
    result &= expect_eq( 'robot_' + robot.id + '.y', robot.y, y );
    if ( robot.orientation.is_set() ) {
        result &= expect_eq( 'robot_' + robot.id + '.o', robot.orientation.get_char(), o );
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
    robot.turn_left();
    expect_not_null( 'robot.cell', robot._cell );
    expect_robot_position(robot, 0, 0, 'e');
    robot.move_forward();
    expect_robot_position(robot, 1, 0, 'e');
    robot.move_backward();
    expect_robot_position(robot, 0, 0, 'e');
    robot.slide_right();
    expect_robot_position(robot, 0, 1, 'e');
    robot.slide_left();
    expect_robot_position(robot, 0, 0, 'e');
    robot.turn_right();
    expect_robot_position(robot, 0, 0, 's');
    robot.move_forward();
    expect_robot_position(robot, 0, 1, 's');
    robot.move_backward();
    expect_robot_position(robot, 0, 0, 's');
    robot.slide_left();
    expect_robot_position(robot, 1, 0, 's');
    robot.slide_right();
    expect_robot_position(robot, 0, 0, 's');
    robot.turn_right();
    expect_robot_position(robot, 0, 0, 'w');
    robot.move_backward();
    expect_robot_position(robot, 1, 0, 'w');
    robot.move_forward();
    expect_robot_position(robot, 0, 0, 'w');
    robot.slide_left();
    expect_robot_position(robot, 0, 1, 'w');
    robot.slide_right();
    expect_robot_position(robot, 0, 0, 'w');
    robot.turn_right();
    expect_robot_position(robot, 0, 0, 'n');
    robot.move_backward();
    expect_robot_position(robot, 0, 1, 'n');
    robot.move_forward();
    expect_robot_position(robot, 0, 0, 'n');
    robot.slide_right();
    expect_robot_position(robot, 1, 0, 'n');
    robot.slide_left();
    expect_robot_position(robot, 0, 0, 'n');
    robot.turn_left();
    expect_robot_position(robot, 0, 0, 'w');
    robot.uturn();
    expect_robot_position(robot, 0, 0, 'e');
    robot.uturn();
    expect_robot_position(robot, 0, 0, 'w');
    robot.turn_left();
    expect_robot_position(robot, 0, 0, 's');
    robot.turn_left();
    expect_robot_position(robot, 0, 0, 'e');
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
    robot.turn_left();
    expect_not_null( 'robot.cell', robot._cell );
    expect_robot_position(robot, 0, 0, 's', 10);
    // go hit the wall
    robot.move_forward();
    robot.turn_left();
    robot.move_forward();
    expect_robot_position(robot, 1, 1, 'e', 10);
    robot.move_forward();
    expect_robot_position(robot, 1, 1, 'e', 9);
    robot.move_forward();
    expect_robot_position(robot, 1, 1, 'e', 8);
    robot.move_forward();
    expect_robot_position(robot, 1, 1, 'e', 7);
    robot.move_backward();
    expect_robot_position(robot, 0, 1, 'e', 7);
    robot.move_backward();
    expect_robot_position(robot, null, null, null, 0);
}

{
    start_test( 'interaction' );
    var board = test_board; 
    var robot = new Robot( 42 );
    robot.initialize( board.get_cell( 0, 0 ) );
    robot.turn_left();
    expect_robot_position(robot, 0, 0, 's', 10);
    var robot_2 = new Robot( 2 );
    robot_2.initialize( board.get_cell( 1, 1 ) );
    robot_2.turn_left();
    expect_robot_position(robot_2, 1, 1, 'n', 10);
    var robot_3 = new Robot( 3 );
    robot_3.initialize( board.get_cell( 1, 2 ) );
    robot_3.turn_left();
    expect_robot_position(robot_3, 1, 2, 'w', 10);
    var robot_4 = new Robot( 4 );
    robot_4.initialize( board.get_cell( 2, 2 ) );
    robot_4.turn_left();
    expect_robot_position(robot_4, 2, 2, 'w', 10);
    robot.move_forward();
    robot.turn_left();
    robot.move_forward();
    expect_robot_position(robot, 0, 1, 'e', 9);
    expect_robot_position(robot_2, 1, 1, 'n', 9);
    expect_robot_position(robot_3, 1, 2, 'w', 10);
    expect_robot_position(robot_4, 2, 2, 'w', 10);
    robot.slide_right();
    robot.move_forward();
    expect_robot_position(robot, 0, 2, 'e', 8);
    expect_robot_position(robot_2, 1, 1, 'n', 9);
    expect_robot_position(robot_3, 1, 2, 'w', 9);
    expect_robot_position(robot_4, 2, 2, 'w', 9);
    robot.slide_left();
    robot.slide_left();
    robot.move_forward();
    robot.turn_right();
    robot.move_forward();
    expect_robot_position(robot, 1, 1, 's', 8);
    expect_robot_position(robot_2, 1, 2, 'n', 9);
    expect_robot_position(robot_3, null, null, null, 0);
    expect_robot_position(robot_4, 2, 2, 'w', 9);
}

{
    start_test( 'shoot' );
    var board = test_board;
    var robot = new Robot( 42 );
    robot.initialize( board.get_cell( 0, 0 ) );
    robot.turn_left();
    expect_robot_position(robot, 0, 0, 'e', 10);
    var robot_2 = new Robot( 2 );
    robot_2.initialize( board.get_cell( 3, 0 ) );
    robot_2.turn_left();
    expect_robot_position(robot_2, 3, 0, 'e', 10);
    robot.shoot();
    robot_2.uturn();
    robot_2.shoot();
    expect_robot_position(robot, 0, 0, 'e', 9);
    expect_robot_position(robot_2, 3, 0, 'w', 9);
    robot.slide_right();
    robot_2.slide_left();
    robot.shoot();
    robot_2.shoot();
    expect_robot_position(robot, 0, 1, 'e', 9);
    expect_robot_position(robot_2, 3, 1, 'w', 9);
    robot.turn_left();
    robot_2.turn_left();
    robot.shoot();
    robot_2.shoot();
    expect_robot_position(robot, 0, 1, 'n', 9);
    expect_robot_position(robot_2, 3, 1, 's', 9);
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
            expect_robot_position(robot, 3, 0, 'e', 10);
            expect_eq( 'robot[41].name', robot.name, 'robot 41' );
            expect_eq( 'robot[41].color', robot.color, '#a73338' );
            expect_eq( 'robot[41].status', robot.status, 'has_turn' );
        }
        {
            var robot = state.get_robot(42);
            expect_robot_position(robot, 0, 0, 'e', 10);
            expect_eq( 'robot[42].name', robot.name, 'robot 42' );
            expect_eq( 'robot[42].color', robot.color, '#538f5b' );
            expect_eq( 'robot[42].status', robot.status, 'has_turn' );
        }
        {
            var robot = state.get_robot(43);
            expect_robot_position(robot, 2, 2, 's', 10);
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
            expect_robot_position(robot, 3, 0, 'e', 10);
            expect_eq( 'robot[41].name', robot.name, 'robot 41' );
            expect_eq( 'robot[41].color', robot.color, '#a73338' );
            expect_eq( 'robot[41].status', robot.status, 'has_turn' );
        }
        {
            var robot = state.get_robot(42);
            expect_robot_position(robot, 0, 0, 'e', 42);
            expect_eq( 'robot[42].name', robot.name, 'robot 42' );
            expect_eq( 'robot[42].color', robot.color, '#538f5b' );
            expect_eq( 'robot[42].status', robot.status, 'has_turn' );
        }
        {
            var robot = state.get_robot(43);
            expect_robot_position(robot, 2, 2, 's', 10);
            expect_null( 'robot[43].name', robot.name );
            expect_null( 'robot[43].color', robot.color );
            expect_null( 'robot[43].status', robot.status );
        }
    }
}

var test_plynd_state = null;

{
    start_test( 'server_initialize_state' );
    server_initialize_state( test_metadata, null, null, function( plynd_state ) {
        test_plynd_state = plynd_state;
        expect_not_null( 'plynd_state', plynd_state );
        {
            assert_true( '41 in robots', '41' in plynd_state.robots );
            var plynd_robot = plynd_state.robots[ '41' ];
            expect_not_null( 'plynd_robot', plynd_robot );
            expect_eq( 'plynd_robot[41].x', plynd_robot.x, 0 );
            expect_eq( 'plynd_robot[41].y', plynd_robot.y, 0 );
            expect_eq( 'plynd_robot[41].o', plynd_robot.o, 'n' );
            expect_eq( 'plynd_robot[41].p', plynd_robot.p, 10 );
            expect_eq( 'plynd_robot[41].h', plynd_robot.programs.join(), 'L,1,r,l,1,s,s,1,L,b' );
        }
        {
            assert_true( '42 in robots', '42' in plynd_state.robots );
            var plynd_robot = plynd_state.robots[ '42' ];
            expect_not_null( 'plynd_robot', plynd_robot );
            expect_eq( 'plynd_robot[42].x', plynd_robot.x, 3 );
            expect_eq( 'plynd_robot[42].y', plynd_robot.y, 0 );
            expect_eq( 'plynd_robot[42].o', plynd_robot.o, 'n' );
            expect_eq( 'plynd_robot[42].p', plynd_robot.p, 10 );
            expect_eq( 'plynd_robot[42].h', plynd_robot.programs.join(), '1,r,2,l,r,2,l,b,2,1' );
        }
        {
            assert_true( '43 in robots', '43' in plynd_state.robots );
            var plynd_robot = plynd_state.robots[ '43' ];
            expect_not_null( 'plynd_robot', plynd_robot );
            expect_eq( 'plynd_robot[43].x', plynd_robot.x, 2 );
            expect_eq( 'plynd_robot[43].y', plynd_robot.y, 2 );
            expect_eq( 'plynd_robot[43].o', plynd_robot.o, 'e' );
            expect_eq( 'plynd_robot[43].p', plynd_robot.p, 10 );
            expect_eq( 'plynd_robot[43].h', plynd_robot.programs.join(), '3,2,1,2,1,3,l,r,R,u' );
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
            expect_eq( 'robots[' + test_metadata.ownPlayerID + '].registers', robot.registers.join(), '7,9,6,8,4' );
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
            expect_eq( 'robots[' + test_metadata.ownPlayerID + '].registers', robot.registers.join(), '3,6,4,2,7' );
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
            expect_eq( 'robots[' + test_metadata.ownPlayerID + '].registers', robot.registers.join(), '6,4,5,1,3' );
        }, forbidden_error_callback );
        // debug( 'state.robots[' + test_metadata.ownPlayerID + ']', test_plynd_state.robots[ test_metadata.ownPlayerID ] );
    }
    // debug( 'state.robots', test_plynd_state.robots );
}

{
    start_test( 'success: conveyor belts' );
    {
        var board_text = '';
        board_text += '         ';
        board_text += '+-+ + +-+';
        board_text += '   > V <|';
        board_text += '+ + + + +';
        board_text += ' > > V   ';
        board_text += '+ + + + +';
        board_text += '   A < < ';
        board_text += '+ + + + +';
        board_text += '|  A A <|';
        board_text += '+-+ + + +';
        var board = load_board_from_text( board_text );
        expect_not_null( '[conveyor-belt] board', board );
        // row 0
        {
            var x = 0, y = 0, cell = board.get_cell( x, y );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt', cell.has_conveyor_belt() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_east() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_west', cell.has_conveyor_belt_coming_from_south() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_west() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_north() );
        }
        {
            var x = 1, y = 0, cell = board.get_cell( x, y );
            expect_not_null( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt', cell.has_conveyor_belt() );
            expect_true( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_toward_east', cell.has_conveyor_belt_toward_east() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_east() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_west', cell.has_conveyor_belt_coming_from_south() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_west() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_north() );
        }
        {
            var x = 2, y = 0, cell = board.get_cell( x, y );
            expect_not_null( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt', cell.has_conveyor_belt() );
            expect_true( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_toward_south', cell.has_conveyor_belt_toward_south() );
            expect_true( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_east() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_west', cell.has_conveyor_belt_coming_from_south() );
            expect_true( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_west() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_north() );
        }
        {
            var x = 3, y = 0, cell = board.get_cell( x, y );
            expect_not_null( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt', cell.has_conveyor_belt() );
            expect_true( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_toward_west', cell.has_conveyor_belt_toward_west() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_east() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_west', cell.has_conveyor_belt_coming_from_south() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_west() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_north() );
        }
        // row 1
        {
            var x = 0, y = 1, cell = board.get_cell( x, y );
            expect_not_null( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt', cell.has_conveyor_belt() );
            expect_true( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_toward_east', cell.has_conveyor_belt_toward_east() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_east() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_west', cell.has_conveyor_belt_coming_from_south() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_west() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_west() );
        }
        {
            var x = 1, y = 1, cell = board.get_cell( x, y );
            expect_not_null( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt', cell.has_conveyor_belt() );
            expect_true( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_toward_east', cell.has_conveyor_belt_toward_east() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_east() );
            expect_true( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_west', cell.has_conveyor_belt_coming_from_south() );
            expect_true( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_west() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_north() );
        }
        {
            var x = 2, y = 1, cell = board.get_cell( x, y );
            expect_not_null( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt', cell.has_conveyor_belt() );
            expect_true( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_toward_south', cell.has_conveyor_belt_toward_south() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_east() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_west', cell.has_conveyor_belt_coming_from_south() );
            expect_true( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_west() );
            expect_true( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_north() );
        }
        {
            var x = 3, y = 1, cell = board.get_cell( x, y );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt', cell.has_conveyor_belt() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_east() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_west', cell.has_conveyor_belt_coming_from_south() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_west() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_north() );
        }
        // row 2
        {
            var x = 0, y = 2, cell = board.get_cell( x, y );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt', cell.has_conveyor_belt() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_east() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_west', cell.has_conveyor_belt_coming_from_south() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_west() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_north() );
        }
        {
            var x = 1, y = 2, cell = board.get_cell( x, y );
            expect_not_null( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt', cell.has_conveyor_belt() );
            expect_true( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_toward_north', cell.has_conveyor_belt_toward_north() );
            expect_true( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_east() );
            expect_true( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_west', cell.has_conveyor_belt_coming_from_south() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_west() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_north() );
        }
        {
            var x = 2, y = 2, cell = board.get_cell( x, y );
            expect_not_null( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt', cell.has_conveyor_belt() );
            expect_true( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_toward_west', cell.has_conveyor_belt_toward_west() );
            expect_true( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_east() );
            expect_true( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_west', cell.has_conveyor_belt_coming_from_south() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_west() );
            expect_true( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_north() );
        }
        {
            var x = 3, y = 2, cell = board.get_cell( x, y );
            expect_not_null( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt', cell.has_conveyor_belt() );
            expect_true( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_toward_west', cell.has_conveyor_belt_toward_west() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_east() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_west', cell.has_conveyor_belt_coming_from_south() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_west() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_north() );
        }
        // row 3
        {
            var x = 0, y = 3, cell = board.get_cell( x, y );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt', cell.has_conveyor_belt() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_east() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_west', cell.has_conveyor_belt_coming_from_south() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_west() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_north() );
        }
        {
            var x = 1, y = 3, cell = board.get_cell( x, y );
            expect_not_null( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt', cell.has_conveyor_belt() );
            expect_true( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_toward_north', cell.has_conveyor_belt_toward_north() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_east() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_west', cell.has_conveyor_belt_coming_from_south() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_west() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_north() );
        }
        {
            var x = 2, y = 3, cell = board.get_cell( x, y );
            expect_not_null( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt', cell.has_conveyor_belt() );
            expect_true( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_toward_north', cell.has_conveyor_belt_toward_north() );
            expect_true( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_east() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_west', cell.has_conveyor_belt_coming_from_south() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_west() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_north() );
        }
        {
            var x = 3, y = 3, cell = board.get_cell( x, y );
            expect_not_null( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt', cell.has_conveyor_belt() );
            expect_true( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_toward_west', cell.has_conveyor_belt_toward_west() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_east() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_west', cell.has_conveyor_belt_coming_from_south() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_west() );
            expect_false( '[conveyor-belt] cell_' + x + '_' + y + '.has_conveyor_belt_coming_from_east', cell.has_conveyor_belt_coming_from_north() );
        }
    }
}

{
    start_test( 'error: conveyor belts' );
    expect_exception( '[conveyor-belt-1]', function() {
        var board_text = '';
        board_text += '     ';
        board_text += '+ + +';
        board_text += ' > < ';
        board_text += '+ + +';
        load_board_from_text( board_text );
    } );
    expect_exception( '[conveyor-belt-2]', function() {
        var board_text = '';
        board_text += '     ';
        board_text += '+ + +';
        board_text += ' V   ';
        board_text += '+ + +';
        board_text += ' A   ';
        board_text += '+ + +';
        load_board_from_text( board_text );
    } );
}

{
    start_test( 'move: conveyor belts' );
    {
        var board_text = '';
        board_text += '       ';
        board_text += '+ + + +';
        board_text += ' V V < ';
        board_text += '+ + + +';
        board_text += ' >   < ';
        board_text += '+ + + +';
        board_text += ' > A A ';
        board_text += '+ + + +';
        var board = load_board_from_text( board_text );
        var robot = new Robot( 42 );
        {
            robot.initialize( board.get_cell( 0, 0 ), 's' );
            expect_robot_position( robot, 0, 0, 's' );
            robot.activate_conveyor_belt();
            expect_robot_position( robot, 0, 1, 'e' );
            robot.activate_conveyor_belt();
            expect_robot_position( robot, 1, 1, 'e' );
        }
        {
            robot.initialize( board.get_cell( 0, 2 ), 'w' );
            expect_robot_position( robot, 0, 2, 'w' );
            robot.activate_conveyor_belt();
            expect_robot_position( robot, 1, 2, 's' );
            robot.activate_conveyor_belt();
            expect_robot_position( robot, 1, 1, 's' );
        }
        {
            robot.initialize( board.get_cell( 2, 0 ), 'n' );
            expect_robot_position( robot, 2, 0, 'n' );
            robot.activate_conveyor_belt();
            expect_robot_position( robot, 1, 0, 'w' );
            robot.activate_conveyor_belt();
            expect_robot_position( robot, 1, 1, 'w' );
        }
        {
            robot.initialize( board.get_cell( 2, 2 ), 's' );
            expect_robot_position( robot, 2, 2, 's' );
            robot.activate_conveyor_belt();
            expect_robot_position( robot, 2, 1, 'e' );
            robot.activate_conveyor_belt();
            expect_robot_position( robot, 1, 1, 'e' );
        }
    }
    {
        var board_text = '';
        board_text += '       ';
        board_text += '+ + + +';
        board_text += ' > V V ';
        board_text += '+ + + +';
        board_text += ' >   < ';
        board_text += '+ + + +';
        board_text += ' A A < ';
        board_text += '+ + + +';
        var board = load_board_from_text( board_text );
        var robot = new Robot( 42 );
        {
            robot.initialize( board.get_cell( 0, 0 ), 's' );
            expect_robot_position( robot, 0, 0, 's' );
            robot.activate_conveyor_belt();
            expect_robot_position( robot, 1, 0, 'w' );
            robot.activate_conveyor_belt();
            expect_robot_position( robot, 1, 1, 'w' );
        }
        {
            robot.initialize( board.get_cell( 0, 2 ), 's' );
            expect_robot_position( robot, 0, 2, 's' );
            robot.activate_conveyor_belt();
            expect_robot_position( robot, 0, 1, 'w' );
            robot.activate_conveyor_belt();
            expect_robot_position( robot, 1, 1, 'w' );
        }
        {
            robot.initialize( board.get_cell( 2, 0 ), 's' );
            expect_robot_position( robot, 2, 0, 's' );
            robot.activate_conveyor_belt();
            expect_robot_position( robot, 2, 1, 'w' );
            robot.activate_conveyor_belt();
            expect_robot_position( robot, 1, 1, 'w' );
        }
        {
            robot.initialize( board.get_cell( 2, 2 ), 'e' );
            expect_robot_position( robot, 2, 2, 'e' );
            robot.activate_conveyor_belt();
            expect_robot_position( robot, 1, 2, 's' );
            robot.activate_conveyor_belt();
            expect_robot_position( robot, 1, 1, 's' );
        }
    }
}

{
    start_test( 'move blocked: conveyor belts' );
    {
        var board_text = '';
        board_text += '       ';
        board_text += '+ + + +';
        board_text += '   V   ';
        board_text += '+ + + +';
        board_text += ' >   < ';
        board_text += '+ + + +';
        board_text += '   A   ';
        board_text += '+ + + +';
        var board = load_board_from_text( board_text );
        var other_robot = new Robot( 43 );
        var robot = new Robot( 42 );
        {
            robot.initialize( board.get_cell( 1, 0 ), 'e' );
            other_robot.initialize( board.get_cell( 1, 1 ), 'w' );
            expect_robot_position( robot, 1, 0, 'e', 10 );
            expect_robot_position( other_robot, 1, 1, 'w', 10 );
        }
        {
            robot.activate_conveyor_belt();
            other_robot.activate_conveyor_belt();
            expect_robot_position( robot, 1, 0, 'e', 10 );
            expect_robot_position( other_robot, 1, 1, 'w', 10 );
        }
        {
            other_robot.move_forward();
            expect_robot_position( robot, 1, 0, 'e', 10 );
            expect_robot_position( other_robot, 0, 1, 'w', 10 );
        }
        {
            robot.activate_conveyor_belt();
            other_robot.activate_conveyor_belt();
            expect_robot_position( robot, 1, 1, 'e', 10 );
            expect_robot_position( other_robot, 0, 1, 'w', 10 );
        }
        {
            other_robot.move_backward();
            expect_robot_position( robot, 2, 1, 'e', 10 );
            expect_robot_position( other_robot, 1, 1, 'w', 10 );
        }
        {
            other_robot.move_forward();
            expect_robot_position( robot, 2, 1, 'e', 10 );
            expect_robot_position( other_robot, 0, 1, 'w', 10 );
        }
        {
            other_robot.activate_conveyor_belt();
            robot.activate_conveyor_belt();
            expect_robot_position( robot, 2, 1, 'e', 10 );
            expect_robot_position( other_robot, 1, 1, 'w', 10 );
        }
    }
}

{
    start_test( 'move & die: conveyor belts' );
    {
        var board_text = '';
        board_text += '       ';
        board_text += '+ + + +';
        board_text += '   V   ';
        board_text += '+ +-+ +';
        board_text += ' > # < ';
        board_text += '+ + + +';
        board_text += ' V   A ';
        board_text += '+ + + +';
        var board = load_board_from_text( board_text );
        var robot = new Robot( 42 );
        {
            robot.initialize( board.get_cell( 0, 0 ), 'e' );
            expect_robot_position( robot, 0, 0, 'e', 10 );
            robot.move_forward();
            expect_robot_position( robot, 1, 0, 'e', 10 );
            robot.activate_conveyor_belt();
            expect_robot_position( robot, 1, 0, 'e', 9 );
            robot.activate_conveyor_belt();
            robot.activate_conveyor_belt();
            robot.activate_conveyor_belt();
            robot.activate_conveyor_belt();
            robot.activate_conveyor_belt();
            robot.activate_conveyor_belt();
            robot.activate_conveyor_belt();
            robot.activate_conveyor_belt();
            expect_robot_position( robot, 1, 0, 'e', 1 );
            robot.activate_conveyor_belt();
            expect_robot_position( robot, null, null, null, 0 );
        }
        {
            robot.initialize( board.get_cell( 0, 0 ), 'e' );
            expect_robot_position( robot, 0, 0, 'e', 10 );
            robot.slide_right();
            expect_robot_position( robot, 0, 1, 'e', 10 );
            robot.activate_conveyor_belt();
            expect_robot_position( robot, null, null, null, 0 );
        }
        {
            robot.initialize( board.get_cell( 1, 2 ), 's' );
            expect_robot_position( robot, 1, 2, 's', 10 );
            robot.uturn();
            robot.slide_right();
            expect_robot_position( robot, 2, 2, 'n', 10 );
            robot.activate_conveyor_belt();
            expect_robot_position( robot, 2, 1, 'w', 10 );
            robot.move_forward();
            expect_robot_position( robot, null, null, null, 0 );
        }
        {
            robot.initialize( board.get_cell( 1, 2 ), 's' );
            expect_robot_position( robot, 1, 2, 's', 10 );
            robot.uturn();
            robot.slide_left();
            expect_robot_position( robot, 0, 2, 'n', 10 );
            robot.activate_conveyor_belt();
            expect_robot_position( robot, null, null, null, 0 );
        }
    }
}


test_report();
