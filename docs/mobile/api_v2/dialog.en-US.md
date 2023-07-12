---
title: Dialog
description: A modal view that interrupts the current action to display an important prompt or request an important action from the user
spline: base
isComponent: true
toc: false
---

## Code demo

The default button style is' variant = text ', if any button changes' variant ', then all buttons change to this.

### Component type

#### Feedback class dialog box

Used when a user performs an operation that communicates important information and informs the user of the current situation.

{{ feedback }}

#### Confirm class dialog box

It is used when the user performs an operation that has serious consequences and requires the user to confirm twice. For example, exit, delete, and clear

{{ confirm }}

#### Enter the dialog box

After an operation is performed, the user needs to enter the necessary information for the next operation. Such as entering a password

{{ input }}

#### with a picture dialog box

Image elements can be inserted into the dialog box and the position can be customized.

{{ image-dialog }}

### component status

Text button, horizontal base button, vertical base button, multi-button, with close button

{{ multi-state }}

### component usage

Command line call

{{ plugin }}