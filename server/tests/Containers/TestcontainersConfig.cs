using DotNet.Testcontainers.Configurations;

namespace tests.Containers;

public static class TestcontainersConfig
{
    static TestcontainersConfig()
    {
        TestcontainersSettings.ResourceReaperEnabled = false;
    }
}