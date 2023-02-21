# Screeps Rover

This project aims to explore javascript stuff while playing screeps. The idea is
to keep my mind and skills focused on generating good JS code while still having
a play ground to test out new ideas and methods.

## What screeps adds to the mix

Screeps is a game that uses Javascript to interact with the game world. This
adds some unusual constraints. The most interesting is trying to get tasks done
with what today would be considered strict memory and CPU limits. While the CPU
and memory limits are not "_real_" they are very close to _real_. Writing code
while thinking of _memory_ and _CPU_ this way has already helped me write more
scalable back-end code, and more client friendly front-end code. The other
advantage added by _playing around_ in screeps is having a place to test
interesting coding behaviors like linters, compilers, build scripts, among
others, without having to risk modifying a real project.

## Documentation
<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

*   [BaseCreep][1]
    *   [Parameters][2]
*   [RoomLevel0][3]
    *   [Parameters][4]
    *   [spawns][5]

## BaseCreep

[src/creeps/base\_creep.js:8-93][6]

The Base Creep that all other creeps are based on
these methods should be useful my most/all creeps and should
help prevent having to have `this.creep` in the child classes

### Parameters

*   `creep` **creep** The creep wrapped by the BaseCreep object

## RoomLevel0

[src/lib/RoomLevels/0.js:7-152][7]

This is the base class for all Rooms

### Parameters

*   `room` &#x20;
*   `the` **room** room to be processed

### spawns

[src/lib/RoomLevels/0.js:16-18][8]

My spawns

Returns **any** spawns in a room owned by me

[1]: #basecreep

[2]: #parameters

[3]: #roomlevel0

[4]: #parameters-1

[5]: #spawns

[6]: https://github.com/coteyr/screeps-rover/blob/6c1aded24e352ce862e31c603a41f7331129e729/src/creeps/base_creep.js#L8-L93 "Source code on GitHub"

[7]: https://github.com/coteyr/screeps-rover/blob/6c1aded24e352ce862e31c603a41f7331129e729/src/lib/RoomLevels/0.js#L7-L152 "Source code on GitHub"

[8]: https://github.com/coteyr/screeps-rover/blob/6c1aded24e352ce862e31c603a41f7331129e729/src/lib/RoomLevels/0.js#L16-L18 "Source code on GitHub"
