// Central permission catalog for fine-grained access control

const PERMISSIONS = Object.freeze({
    orders: Object.freeze([
        'orders:read',
        'orders:create',
        'orders:update',
        'orders:delete',
    ]),
    products: Object.freeze([
        'products:read',
        'products:create',
        'products:update',
        'products:delete',
    ]),
    categories: Object.freeze([
        'categories:read',
        'categories:create',
        'categories:update',
        'categories:delete',
    ]),
    brands: Object.freeze([
        'brands:read',
        'brands:create',
        'brands:update',
        'brands:delete',
    ]),
    users: Object.freeze([
        'users:read',
        'users:update',
        'users:permissions:update',
    ]),
});

const GROUPED_PERMISSIONS = Object.freeze(PERMISSIONS);

const ALL_PERMISSIONS = Object.freeze(
    Object.values(PERMISSIONS).flat()
);

module.exports = {
    GROUPED_PERMISSIONS,
    ALL_PERMISSIONS,
};



