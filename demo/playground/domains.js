/// Domains Class
///
/// A Domains object contains a collection of Dns objects.
/// they represent the domains that are of interest for further querying.
/// The domains can have a key related to it or not.
///
/// The class provides convenient functions for managing the collection
/// of Dns objects.
///
/// There are the following configuration options:
///
/// - automatically add a domain when there is a key for it.
/// - TODO: automatically remove domains when there is no key for it.
///
/// The object sends the following events:
/// `domains_ready`, `domains_updated`
class Domains {
  /// constructor of the Domains object
  /// the constructor can be optionally provided with an array of domains
  /// and some configuration options.
  constructor(domain_array, options) {
    this.options = {'key_auto_add': true, 'key_auto_remove': false};
    if (options) {
      this.options = options
    }
    this.domains = [];
    this.initialized = false;

    // add domains
    if (Array.isArray(domain_array)) {
      for (let i = 0; i < domain_array.length; i++) {
        const domain_name = domain_array[i];
        this.add_domain(domain_name)
      }
    }
    this.initialized = true;

    // send domains ready event
    const event = new CustomEvent('domains_ready')
    window.dispatchEvent(event)
  }

  /// listen for keys changes
  keys_updated(keys_array) {
    // auto add keys
    if (this.options.key_auto_add) {
      for (let i = 0; i < keys_array.length; i++) {
        const key = keys_array[i];
        const domain_item = this.get_domain(key.domain)

        // add domain if it does not exist
        if (!domain_item) {
          this.add_domain(key.domain, key)
        }
      }
    }

    // TODO: auto remove keys
  }

  /// add domain
  add_domain(domain_name, key) {
    let dns_item = new Dns(domain_name, key);
    this.domains.push(dns_item)
    // send updated event
    if (this.initialized) {
      const event = new CustomEvent('domains_updated')
      window.dispatchEvent(event)
    }
  }

  /// Get Domain object
  ///
  /// This function searches for the domain name
  /// and returns the Dns object if found.
  /// The function returns `null` if no domain was found.
  get_domain(domain_name) {
    for (let i = 0; i < this.domains.length; i++) {
      const dns = this.domains[i];
      if (domain_name === dns.domain) {
        return dns
      }
    }
    return null
  }
}
