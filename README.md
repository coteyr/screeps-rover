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
    *   [empty][3]
    *   [full][4]
    *   [has\_task][5]
    *   [task][6]
    *   [task][7]
        *   [Parameters][8]
    *   [controller][9]
*   [RoomLevel0][10]
    *   [Parameters][11]
    *   [spawns][12]

## BaseCreep

[src/creeps/base\_creep.js:8-138][13]

The Base Creep that all other creeps are based on
these methods should be useful my most/all creeps and should
help prevent having to have `this.creep` in the child classes

### Parameters

*   `creep` **creep** The creep wrapped by the BaseCreep object

### empty

[src/creeps/base\_creep.js:17-19][14]

Is the current creep's carry parts empty

Returns **[boolean][15]** true if the creeps has 0 energy, false otherwise.

### full

[src/creeps/base\_creep.js:25-27][16]

Is the current creep full of energy

Returns **[boolean][15]** true if the creep has no more room for energy, false otherwise

### has\_task

[src/creeps/base\_creep.js:33-35][17]

Does the current creep have any task at all

Returns **[boolean][15]** true if the creep has any task at all

### task

[src/creeps/base\_creep.js:41-43][18]

The task the current creep is trying to do

Returns **[string][19]** the task name the creep is trying to carry out

### task

[src/creeps/base\_creep.js:57-62][20]

Set the task the creep should try to do

#### Parameters

*   `value` **[string][19]** The task that should be set

### controller

[src/creeps/base\_creep.js:49-51][21]

Get the controller for the room the creep is currently in

Returns **StructureController** The controller that is in the room the creep is in

## RoomLevel0

[src/lib/RoomLevels/0.js:7-160][22]

This is the base class for all Rooms

### Parameters

*   `room` &#x20;
*   `the` **room** room to be processed

### spawns

[src/lib/RoomLevels/0.js:16-18][23]

My spawns

Returns **any** spawns in a room owned by me

[1]: #basecreep

[2]: #parameters

[3]: #empty

[4]: #full

[5]: #has_task

[6]: #task

[7]: #task-1

[8]: #parameters-1

[9]: #controller

[10]: #roomlevel0

[11]: #parameters-2

[12]: #spawns

[13]: https://github.com/coteyr/screeps-rover/blob/2ba4626079a2475d94340cc6c0c2f26cee453164/src/creeps/base_creep.js#L8-L138 "Source code on GitHub"

[14]: https://github.com/coteyr/screeps-rover/blob/2ba4626079a2475d94340cc6c0c2f26cee453164/src/creeps/base_creep.js#L17-L19 "Source code on GitHub"

[15]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean

[16]: https://github.com/coteyr/screeps-rover/blob/2ba4626079a2475d94340cc6c0c2f26cee453164/src/creeps/base_creep.js#L25-L27 "Source code on GitHub"

[17]: https://github.com/coteyr/screeps-rover/blob/2ba4626079a2475d94340cc6c0c2f26cee453164/src/creeps/base_creep.js#L33-L35 "Source code on GitHub"

[18]: https://github.com/coteyr/screeps-rover/blob/2ba4626079a2475d94340cc6c0c2f26cee453164/src/creeps/base_creep.js#L41-L43 "Source code on GitHub"

[19]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String

[20]: https://github.com/coteyr/screeps-rover/blob/2ba4626079a2475d94340cc6c0c2f26cee453164/src/creeps/base_creep.js#L57-L62 "Source code on GitHub"

[21]: https://github.com/coteyr/screeps-rover/blob/2ba4626079a2475d94340cc6c0c2f26cee453164/src/creeps/base_creep.js#L49-L51 "Source code on GitHub"

[22]: https://github.com/coteyr/screeps-rover/blob/2ba4626079a2475d94340cc6c0c2f26cee453164/src/lib/RoomLevels/0.js#L7-L160 "Source code on GitHub"

[23]: https://github.com/coteyr/screeps-rover/blob/2ba4626079a2475d94340cc6c0c2f26cee453164/src/lib/RoomLevels/0.js#L16-L18 "Source code on GitHub"
