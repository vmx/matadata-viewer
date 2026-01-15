Matadata viewer
===============

This is a viewer of metadata that was published on [ATProto]. The web viewer
gets "matadata" records from the past few minutes from [Bluesky's Jetstream]
and then keeps updating.

Currently the only publisher is the [sentinel-to-atproto] Cloudflare worker. So
you'll see a lot of satellite images being displayed. It's planned that in the
future there will also be other matadata records.


Demo
----

See it in action at https://vmx.github.io/matadata-viewer/.


Running locally
---------------

### Web viewer

This front-end works without a bundler. Though the dependencies need to be
installed. The easiest way is to simply run

    npm install

Now start the local HTTP server of you choice in the current directory. E.g.
the Python built-in one:

    python -m http.server

You can now access the viewer at

    http://localhost:8000/


### CLI viewer

The CLI viewer just displays the metadata records as they arrive.

     npm install
     npm start


License
-------

This project is licensed under either of

 - Apache License, Version 2.0, ([LICENSE-APACHE] or https://www.apache.org/licenses/LICENSE-2.0)
 - MIT license ([LICENSE-MIT] or https://opensource.org/licenses/MIT)

at your option.

[ATProto]: https://atproto.com/
[Bluesky's Jetstream]: https://docs.bsky.app/blog/jetstream
[sentinel-to-atproto]: https://github.com/vmx/sentinel-to-atproto/
[LICENSE-APACHE]: ./LICENSE-APACHE
[LICENSE-MIT]: ./LICENSE-MIT
