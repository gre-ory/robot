
// //////////////////////////////////////////////////
//  helper

var _debug = false;
var _current_test = null;
var _nb_success = 0;
var _nb_total = 0;

function start_test( msg ) {
    test_report();
    console.log( ' ----- test: ' + msg );
    _current_test = msg;
}

function test_report() {
    if ( is_not_null( _current_test ) && ( _nb_total > 0 ) ) {
        console.log( ' ----- test: ' + _current_test + ': ' + parseInt( _nb_success * 100 / ( _nb_total ) ) + '% ( ' + _nb_success + ' / ' + _nb_total + ' )' );
    }
    _current_test = null;
    _nb_success = 0;
    _nb_total = 0;
}

function expect_test( msg, computed, throw_error ) {
    _nb_total += 1;
    if ( !computed ) {
        console.log( ' ----- [x] ' + msg );
        if ( throw_error ) {
            throw msg;
        }
        return false;
    }
    if ( _debug ) {
        console.log( ' ----- [ ] ' + msg );
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
    if ( is_not_null( player.orientation ) ) {
        result &= expect_eq( 'player_' + player.id + '.o', player.orientation.flush(), o );
    }
    else if ( is_not_null( o ) ) {
        result &= expect_eq( 'player_' + player.id + '.o', null, o );
    }
    if ( p !== undefined ) {
        result &= expect_eq( 'player_' + player.id + '.p', player.points, p );
    }
    if ( !result ) {
        console.log( ' ----- [x] player: ' + player.flush() );
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

// //////////////////////////////////////////////////
//  random

random = new Random( 42 );

{
    start_test( 'random' );
    assert_eq( '1st', 2, random.number( 10 ) );
    assert_eq( '2nd', 0, random.number( 10 ) );
    assert_eq( '3rd', 0, random.number( 10 ) );
    assert_eq( '4th', 8, random.number( 10 ) );
    assert_eq( '5th', 7, random.number( 10 ) );
    assert_eq( '6th', 4, random.number( 10 ) );
    assert_eq( '7th', 4, random.number( 10 ) );
    assert_eq( '8th', 2, random.number( 10 ) );
    assert_eq( '9th', 2, random.number( 10 ) );
}

// //////////////////////////////////////////////////
//  board

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
    
    var board = new Board();
    assert_not_null( 'board', board );
    board.load_from_id( 'unknown' );
    
    var cell = board.get_cell( 0, 0 );
    expect_null( 'cell', cell );
    
    var start_cells = board.get_start_cells();
    expect_null( 'start_cells', start_cells );
}

{
    start_test( 'simple board' );
    
    var board = new Board();
    assert_not_null( 'board', board );
    board.load_from_id( 'simple_board' );
    
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
    
    var board = new Board();
    assert_not_null( 'board', board );
    board.load_from_id( 'test_board' );
    
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
    
    var board = new Board();
    board.load_from_id( 'test_board' );
    
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
    
    var board = new Board();
    board.load_from_id( 'test_board' );
    
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
    start_test( 'initialize' );
}

{
    start_test( 'load & dump' );
}

test_report();
