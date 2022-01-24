![faq](https://user-images.githubusercontent.com/15351728/150683210-99e51a85-2cd0-4b96-aecc-699364c7e2f9.png)

### How are measurement groups created?

The plugin searches for the nearest parent group/frame and places it there.

### May I rename/move the measurement groups?

There are two different measurement groups attached groups (📐 Measurements) and detached groups (🔌 Measurements).

With detached groups you can do anything you want.
With attached groups I would not recommend it, because "Figma-Measure" searches for it and needs it to control the measurements.

If "Figma-Measure" does not find one of these groups, it creates new ones.

### Help! Measurements are cut off

First. Don't panic. This is a normal behavior of figma. When you create a frame, it is automatically created with clipped content. That's why it can look like this:

![clip](https://user-images.githubusercontent.com/15351728/150818512-e449696e-146f-48f0-aa25-084cb411d4d3.png)

There are two solutions to this "problem":

- Turn of the content clipping of you frame
- Create a [detached](https://github.com/ph1p/figma-measure/blob/master/docs/detachment.md) measurement and move it to the parent node.