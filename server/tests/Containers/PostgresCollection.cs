using Xunit;

namespace tests.Containers
{[CollectionDefinition("Postgres collection")]
    public class PostgresCollection : ICollectionFixture<PostgresFixture>
    {
        // should be empty
    }

    [Collection("Postgres collection")]
    public class UserServiceTests
    {
        private readonly PostgresFixture _fixture;

        public UserServiceTests(PostgresFixture fixture)
        {
            _fixture = fixture;
        }
    }

}