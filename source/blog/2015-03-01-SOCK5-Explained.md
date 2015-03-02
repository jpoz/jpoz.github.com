---
title: SOCKS 5 Explained

---

It's always good to know your tools you use well. In that vein of thinking I
thought I should know how the proxy I use for each request from my machine
works. I use a socks proxy to route my request behind a VPN.

It is easy to setup:

```shell
ssh -D 8888 mymachine.co
```
The command above runs a proxy on port `8888` through `mymachine.co`.

To use the proxy via curl:

```shell
curl --proxy socks5h://127.0.0.1:8888 google.com
```

But how were each of my requests being routed through that connection? To
understand that I made a little SOCKS proxy implementation myself while
reading [RFC1928](https://www.ietf.org/rfc/rfc1928.txt).

For this article we'll go over the curl command above.

The request starts out by the client sending at least 3 octets. In our case
curl will be sending 4 octets.

<table>
  <th>5</th>
  <th>2</th>
  <th>0</th>
  <th>1</th>
  <td class='ion-arrow-right-a'></td>
</table>

The first octet is the socks version the client is using. In our case `5`.
The client then sends the number of authentication methods it supports. We
aren't going to be using any authentication in this example. So we'll be using
the no authentication method. The RFC specifies that "implementations MUST
support GSSAPI". So even though we're not using it we need to send that we
accept it. So curl sends `2` for two authentication methods. Then sends `0` for
the "NO AUTHENTICATION REQUIRED" method and `1` for the "GSSAPI"
authentication method.

Next the proxy needs to respond back to the authentication attempt. To respond
the proxy will send back the socks version and authentication method it
accepted:

<table class='reply'>
  <td class='ion-arrow-left-a'></td>
  <th>5</th>
  <th>0</th>
</table>

The first octet sent back is the socks version the proxy is using (again 5) and
the authentication response in our case `0`.

Now that the client has authenticated successfully with the proxy it needs to tell
the proxy about the request it would like to make. The request will start off with
specifying the socks version (again). Then telling the proxy which command
it wants to use.

There are three commands the client can call:

* `1` CONNECT command. This is command curl will be using. It will return the
address and port assigned to connect to our destination.
* `2` BIND command. Used to establish secondary connection.
* `3` UDP ASSOCIATE command. Used to support UDP requests.

After the command octet there is one reserved octet that the client needs
to set to `0`.

The client then needs to tell the proxy what type of destination address it be
sending over. The destination address can come in three forms:

* `1` IPv4
* `3` Domain name
* `4` IPv6

Not really sure why they skipped `2`, but we gave curl a domain name
(google.com in our example) so curl will have a type `3` address. Since domains
can be a variable length next the length of our domain name is sent.
Since we're sending over `google.com` curl sends `10`.

<table>
  <th>5</th>
  <th>1</th>
  <th>0</th>
  <th>3</th>
  <th>10</th>
  <td class='ion-arrow-right-a'></td>
</table>

The next 10 octets will be a UTF8 string of our destination domain:

<table><thead>
<tr>
  <th >103</th>
  <th >111</th>
  <th >111</th>
  <th >103</th>
  <th >108</th>
  <th >101</th>
  <th >46</th>
  <th >99</th>
  <th >111</th>
  <th >109</th>
  <td class='ion-arrow-right-a'></td>
</tr>
</thead><tbody>
<tr>
  <td >g</td>
  <td >o</td>
  <td >o</td>
  <td >g</td>
  <td >l</td>
  <td >e</td>
  <td >.</td>
  <td >c</td>
  <td >o</td>
  <td >m</td>
  <td > </td>
</tr>
</tbody></table>

<p>And finally the port the client wants to connect to. In our case port 80.
The port is represented by two octets since a port can be larger than 255.
The two octets are in network byte order (big endian).</p>

<table>
  <th>0</th>
  <th>80</th>
  <td class='ion-arrow-right-a'></td>
</table>

We've now completed our request. The proxy will now respond back if our
connection was successful and what our binding address and port are.

<table class='reply'>
  <td class='ion-arrow-left-a'></td>
  <th>5</th>
  <th>0</th>
  <th>0</th>
  <th>1</th>
  <th>127</th>
  <th>0</th>
  <th>0</th>
  <th>1</th>
  <th>205</th>
  <th>176</th>
</table>

Again we get back the version of the proxy we're using: `5`. Next is the
reply field. In our case a `0`. Which means we have succeeded in connecting to
our destination (see RFC for full list of responses). After the reply is a
reserved octet which is set to `0`. Next is the information needed to connect
to our destination.

First we get the address type. Same types as we used in the CONNECT command. In
our case we get back at IP4 address or type `1`. The IP address is the next 4
octet. Since our proxy is running locally: `127`.`0`.`0`.`1`. Then the port
in the next two octets, again in network byte order. In the example above:
`205` & `176` or port 52656.

The client now knows a connection to google.com is waiting to be connected to
at `127.0.0.1:52656`.

