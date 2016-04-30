# Remarks

## utils

`presenceEncode` and the related functions seems to have been copied from the minimified Facebook's code.
It is quite cryptic and could be more commented. I guess that you reverse engineered it. Maybe add some of your observations ?

`_formatAttachment`

 - There is a comment `TODO: THIS IS REALLY BAD` but does not explain what is the problem.
 - How do I know which properties are available on the attachments ?
 - Solve the `wtf is this?` comment
 - It not only format the attachment but merges two objects, maybe rename this function ?
 - Why are video attachments not documented ?
 
`getFrom` does not seem to handle the case when endToken is not found. Is it the current behaviour normal ?

`makeParsable`: This sounds scary, why are we applying a regex on some HTML ? Also it looks like its used with JSON.parse. What is happening here ?

`genTimestampRelative`: why is `generate` abbreviated here while it's not in some other utils functions ? (for consistency)

`make_defaults`: The way it captures values from the html (with getFrom) feels a bit hacky :/

`mergeWithDefaults`: There is some unreachable code because the duplication of `if(!obj)`

`saveCookies` should use `forEach` instead of map (it just iterates other the array)
