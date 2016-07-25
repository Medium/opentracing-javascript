'use strict';

module.exports = {
    /**
     * Used to inject/join a span using a binary format.
     *
     * A valid binary carrier is any Object with a field named 'buffer' that
     * contains or will contain the binary data.
     */
    FORMAT_BINARY : 'binary',

    /**
     * Used to inject/join a span using a string->string map (represented as a
     * Javascript Object) as a carrier.
     *
     * NOTE: Unlike FORMAT_HTTP_HEADERS, FORMAT_TEXT_MAP places no restrictions
     * on the characters used in either the keys or the values of the map
     * entries.
     *
     * The FORMAT_TEXT_MAP carrier map may contain unrelated data (e.g.,
     * arbitrary gRPC metadata); as such, the Tracer implementation should use
     * a prefix or other convention to distinguish Tracer-specific key:value
     * pairs.
     */
    FORMAT_TEXT_MAP : 'text_map',

    /**
     * Used to inject/join a span using a restricted string->string map
     * (represented as a Javascript Object) as a carrier.
     *
     * Keys and values in the FORMAT_HTTP_HEADERS carrier must be suitable for
     * use as HTTP headers. That is, the keys have a greatly restricted
     * character set, casing for the keys may not be preserved by various
     * intermediaries, and the values should be URL-escaped.
     *
     * The FORMAT_HTTP_HEADERS carrier map may contain unrelated data (e.g.,
     * arbitrary HTTP headers); as such, the Tracer implementation should use a
     * prefix or other convention to distinguish Tracer-specific key:value
     * pairs.
     */
    FORMAT_HTTP_HEADERS : 'http_headers',

    /**
     * A Span may be the "child of" a parent Span. In a “child of” reference,
     * the parent Span depends on the child Span in some capacity.
     *
     * See more about reference types at http://opentracing.io/spec/
     */
    REFERENCE_CHILD_OF : 'child_of',

    /**
     * Some parent Spans do not depend in any way on the result of their child
     * Spans. In these cases, we say merely that the child Span “follows from”
     * the parent Span in a causal sense.
     *
     * See more about reference types at http://opentracing.io/spec/
     */
    REFERENCE_FOLLOWS_FROM : 'follows_from',
};
